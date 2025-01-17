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

    try {
        // FormData 객체 생성 및 데이터 추가
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        // 이미지 파일이 있는 경우에만 추가
        if (fileInput.files[0]) {
            formData.append('img', fileInput.files[0]);
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('서버 에러');
        }

        // 성공 처리
        window.location.href = `/posts/${postId}`;
    } catch (error) {
        console.error('에러 발생:', error);
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
