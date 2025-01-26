import { API_BASE_URL } from './env.js';

const postId = window.location.pathname.split('/')[2];
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitBtn = document.getElementById('submit-btn');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');

titleInput.addEventListener('input', checkInputs);
contentInput.addEventListener('input', checkInputs);

function checkInputs() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title.length > 27) {
        titleError.textContent = '제목은 27자 이내로 작성해주세요.';
        submitBtn.disabled = true;
    } else {
        titleError.textContent = '';
    }

    if (title.length > 0 && content.length > 0) {
        submitBtn.style.backgroundColor = '#7F6AEE';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.backgroundColor = '#ACA0EB';
        submitBtn.disabled = true;
    }

    if (submitBtn.disabled) {
        contentError.textContent = '제목과 본문을 모두 입력해주세요.';
    } else {
        contentError.textContent = '';
    }
}

const fileInput = document.getElementById('image');
fileInput.addEventListener('change', () => {
    // Code to handle file upload
});

const postForm = document.getElementById('post-form');

// 폼 제출 이벤트 핸들러
postForm.addEventListener('submit', async e => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const imageFile = fileInput.files[0];

    try {
        let imageUrl = '';
        if (imageFile) {
            try {
                // Pre-signed URL 요청
                const presignedResponse = await fetch(
                    `${API_BASE_URL}/auth/presigned-url/post`,
                    {
                        credentials: 'include',
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
                    throw new Error('이미지 업로드 URL 생성에 실패했습니다.');
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

        const requestData = {
            title,
            content,
        };
        if (imageUrl) {
            requestData.imgUrl = imageUrl;
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('서버 에러');
        }

        window.location.href = `/posts/${postId}`;
    } catch (error) {
        console.error('에러 발생:', error);
        alert(error.message);
    }
});

// 페이지 로드 시 기존 데이터 가져오기
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('데이터를 가져오는 데 실패했습니다.');
        }

        const postData = await response.json();
        titleInput.value = postData.title;
        contentInput.value = postData.content;

        // 입력 필드가 채워졌으므로 버튼 상태 업데이트
        checkInputs();
    } catch (error) {
        console.error('에러 발생:', error);
    }
});
