import { API_BASE_URL } from './env.js';

const displayError = message => {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
};

const hideError = () => {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'none';
};

const validatePassword = password => {
    if (!password) {
        return '비밀번호를 입력해주세요.';
    }
    if (password.length < 8 || password.length > 20) {
        return '비밀번호는 8자 이상 20자 이하여야 합니다.';
    }
    if (!/[A-Z]/.test(password)) {
        return '비밀번호는 최소 1개의 대문자를 포함해야 합니다.';
    }
    if (!/[a-z]/.test(password)) {
        return '비밀번호는 최소 1개의 소문자를 포함해야 합니다.';
    }
    if (!/[0-9]/.test(password)) {
        return '비밀번호는 최소 1개의 숫자를 포함해야 합니다.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return '비밀번호는 최소 1개의 특수문자를 포함해야 합니다.';
    }
    return null;
};

document
    .querySelector('.modify-button')
    .addEventListener('click', async event => {
        event.preventDefault();

        // 비밀번호 가져오기
        const password = document.getElementById('password').value;
        const confirmPassword =
            document.getElementById('confirmPassword').value;

        // 비밀번호 유효성 검사
        const validationError = validatePassword(password);
        if (validationError) {
            displayError(validationError);
            return;
        }

        // 비밀번호 일치 확인
        if (password !== confirmPassword) {
            displayError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/password`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                displayError(
                    errorData.message || '비밀번호 변경에 실패했습니다.',
                );
                return;
            }

            // 성공시 메인 페이지로 이동
            window.location.href = '/';
        } catch (error) {
            console.error('Error:', error);
            displayError('서버 오류가 발생했습니다.');
        }
    });
