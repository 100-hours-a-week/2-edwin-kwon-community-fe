import { API_BASE_URL } from './env.js';

async function login(emailInput, passwordInput) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailInput,
                password: passwordInput,
            }),
        });
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        // 로그인 성공 시 사용자 정보 저장
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
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

        if (!passwordInput.value) {
            event.preventDefault(); // 폼 전송 막기
            errorMessage.style.display = 'block'; // 오류 메시지 보이기
        } else {
            errorMessage.style.display = 'none';
            try {
                const response = await login(
                    emailInput.value,
                    passwordInput.value,
                );
                if (response) {
                    window.location.href = '/';
                }
            } catch (error) {
                event.preventDefault(); // 폼 전송 막기
                errorMessage.style.display = 'block'; // 오류 메시지 보이기
            }
        }
    });
