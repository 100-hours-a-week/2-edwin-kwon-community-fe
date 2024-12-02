import { API_BASE_URL } from './env.js';

async function getUser(emailInput, passwordInput) {
    try {
        const response = await fetch(`${API_BASE_URL}/user`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

document
    .querySelector('.login-button')
    .addEventListener('click', async function (event) {
        const emailInput = document.querySelector("input[type='text']");
        const passwordInput = document.querySelector("input[type='password']");
        const errorMessage = document.querySelector('.error-message');

        fetch();
        if (!passwordInput.value) {
            event.preventDefault(); // 폼 전송 막기
            errorMessage.style.display = 'block'; // 오류 메시지 보이기
        } else {
            errorMessage.style.display = 'none'; // 오류 메시지 숨기기
            const user = await getUser(emailInput.value, passwordInput.value);
            if (user) {
                localStorage.setItem('userToken', 'TOKEN');
                window.location.href = '/';
            } else {
                event.preventDefault(); // 폼 전송 막기
                errorMessage.style.display = 'block'; // 오류 메시지 보이기
            }
        }
    });
