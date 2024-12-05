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
                // 프로필 이미지 설정
                if (userData.img) {
                    profilePicture.style.backgroundImage = `url(${PUBLIC_URL}${userData.img})`;
                    profilePicture.style.backgroundSize = 'cover';
                    profilePicture.style.backgroundPosition = 'center';
                }
            } else {
                // window.location.href = '/login';
            }
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
            showToastMessage('프로필 정보를 불러오는데 실패했습니다.');
        }
    }

    // 초기 프로필 정보 로드
    await loadUserProfile();

    form.addEventListener('click', event => {
        // Prevent the form from submitting
        event.preventDefault();

        // Clear any previous error messages
        nicknameError.textContent = '';

        const nicknameValue = nicknameInput.value.trim();

        // Check if the nickname is empty
        if (nicknameValue === '') {
            nicknameError.textContent = '*닉네임을 입력해주세요.';
            return;
        }

        // Check for duplicate nickname (this is a placeholder condition, you may need to implement an API call to check for actual duplicates)
        if (nicknameValue === 'testNickname') {
            nicknameError.textContent = '*중복된 닉네임입니다.';
            return;
        }
        // Check if the nickname is longer than 10 characters
        if (nicknameValue.length > 10) {
            nicknameError.textContent = '*최대 10글자까지 입력 가능합니다.';
            return;
        }

        // If all validations pass, you can submit the form
        //form.submit();
        showToastMessage('수정완료');
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
    confirmQuitButton.addEventListener('click', () => {
        // 회원 탈퇴 처리 로직
        confirmQuitModal.classList.remove('show'); // show 클래스 제거
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
