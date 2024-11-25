import API_BASE_URL from './env.js';

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
// 파일을 Base64로 변환하는 함수
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 폼 제출 이벤트 핸들러
postForm.addEventListener('submit', async e => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    try {
        let imageBase64 = null;

        // 파일이 선택되었다면 Base64로 변환
        if (fileInput.files[0]) {
            imageBase64 = await getBase64(fileInput.files[0]);
        }
        console.log(title, content);
        const postData = {
            title,
            content,
            img: imageBase64,
        };
        // JSON 형태로 전송
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(postData),
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
