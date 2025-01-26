// editProfile.js

import { API_BASE_URL, PUBLIC_URL } from './env.js';

function showToastMessage(message) {
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast-message');
    toastElement.textContent = message;

    document.body.appendChild(toastElement);

    setTimeout(() => {
        toastElement.remove();
    }, 3000); // Hide the toast message after 3 seconds
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.edit-form');
    const nicknameInput = document.getElementById('nickname');
    const nicknameError = document.getElementById('nicknameError');
    const emailDiv = document.querySelector('[for="email"] + div');
    const profilePicture = document.getElementById('profilePicture');
    const fileInput = document.getElementById('fileInput');
    const quitButton = document.getElementById('quitButton');
    const confirmQuitModal = document.getElementById('confirmQuitModal');
    const confirmQuitButton = document.getElementById('confirmQuitButton');
    const cancelQuitButton = document.getElementById('cancelQuitButton');

    let originalNickname = ''; // 원래 닉네임을 저장할 변수 추가

    // 사용자 정보 불러오기
    async function loadUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                // 이메일 설정
                emailDiv.textContent = userData.email;
                // 닉네임 설정
                nicknameInput.value = userData.nickname;
                originalNickname = userData.nickname; // 원래 닉네임 저장
                // 프로필 이미지 설정
                if (userData.img) {
                    profilePicture.style.backgroundImage = `url(${userData.img})`;
                    profilePicture.style.backgroundSize = 'cover';
                    profilePicture.style.backgroundPosition = 'center';
                }
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
            showToastMessage('프로필 정보를 불러오는데 실패했습니다.');
        }
    }

    // 초기 프로필 정보 로드
    await loadUserProfile();

    form.addEventListener('submit', async event => {
        event.preventDefault();
        nicknameError.textContent = '';

        const nicknameValue = nicknameInput.value.trim();
        const imageFile = fileInput.files[0];

        // 닉네임 유효성 검사
        if (nicknameValue === '') {
            nicknameError.textContent = '*닉네임을 입력해주세요.';
            return false;
        }

        if (nicknameValue.length > 10) {
            nicknameError.textContent = '*최대 10글자까지 입력 가능합니다.';
            return false;
        }

        try {
            let imageUrl = '';
            if (imageFile) {
                try {
                    // Pre-signed URL 요청
                    const presignedResponse = await fetch(
                        `${API_BASE_URL}/auth/presigned-url/profile`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                fileType: imageFile.type,
                            }),
                        },
                    );

                    if (!presignedResponse.ok) {
                        throw new Error(
                            '이미지 업로드 URL 생성에 실패했습니다.',
                        );
                    }

                    const { presignedUrl, cloudFrontUrl } =
                        await presignedResponse.json();

                    // S3에 직접 업로드
                    const uploadResponse = await fetch(presignedUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': imageFile.type,
                        },
                        body: imageFile,
                    });

                    if (!uploadResponse.ok) {
                        throw new Error('이미지 업로드에 실패했습니다.');
                    }

                    imageUrl = cloudFrontUrl;
                } catch (error) {
                    console.error('이미지 업로드 에러:', error);
                    throw error;
                }
            }

            const requestData = {};
            if (nicknameValue !== originalNickname) {
                requestData.nickname = nicknameValue;
            }
            if (imageUrl) {
                requestData.imgUrl = imageUrl;
            }

            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                showToastMessage('프로필이 성공적으로 수정되었습니다.');
                await loadUserProfile();
            } else {
                const errorData = await response.json();
                showToastMessage(
                    errorData.message || '프로필 수정에 실패했습니다.',
                );
            }
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            showToastMessage('프로필 수정 중 오류가 발생했습니다.');
        }
    });

    // 회원 탈퇴 버튼 클릭 시
    quitButton.addEventListener('click', e => {
        e.preventDefault(); // 폼 제출 방지
        confirmQuitModal.classList.add('show'); // show 클래스 추가
    });

    // 취소 버튼 클릭 시
    cancelQuitButton.addEventListener('click', () => {
        confirmQuitModal.classList.remove('show'); // show 클래스 제거
    });

    // 확인 버튼 클릭 시
    confirmQuitButton.addEventListener('click', async () => {
        // 회원 탈퇴 처리 로직
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            window.location.href = '/';
        }
    });

    // 프로필 이미지 업로드 및 삭제 기능
    profilePicture.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = event => {
                profilePicture.style.backgroundImage = `url(${event.target.result})`;
                profilePicture.querySelector('.upload-icon').style.display =
                    'none';
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            // 파일이 선택되지 않은 경우 이미지 초기화
            profilePicture.style.backgroundImage = 'none';
            profilePicture.querySelector('.upload-icon').style.display =
                'block';
        }
    });
});
