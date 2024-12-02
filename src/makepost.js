import { API_BASE_URL } from './env.js';

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

        // FormData로 전송
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            body: formData, // headers 제거 - FormData는 자동으로 설정됨
        });

        if (!response.ok) {
            throw new Error('서버 에러');
        }

        // 성공 처리
        window.location.href = '/';
    } catch (error) {
        console.error('에러 발생:', error);
    }
});
