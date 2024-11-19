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
