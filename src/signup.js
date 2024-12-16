import { API_BASE_URL } from './env.js';

// 프로필 이미지 업로드 및 삭제 기능
const profilePicture = document.getElementById('profilePicture');
const fileInput = document.getElementById('fileInput');

profilePicture.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = event => {
            profilePicture.style.backgroundImage = `url(${event.target.result})`;
            profilePicture.querySelector('.upload-icon').style.display = 'none';
        };
        reader.readAsDataURL(e.target.files[0]);
    } else {
        // 파일이 선택되지 않은 경우 이미지 초기화
        profilePicture.style.backgroundImage = 'none';
        profilePicture.querySelector('.upload-icon').style.display = 'block';
    }
});

// 회원가입 폼 제출 처리
const signupForm = document.querySelector('.signup-form');

// 이메일 유효성 검사 함수
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사 함수
function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
    return passwordRegex.test(password);
}

// 닉네임 유효성 검사 함수
function validateNickname(nickname) {
    return nickname.length <= 10 && !nickname.includes(' ');
}

// 회원가입 폼 제출 처리 부분 수정
signupForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickname = document.getElementById('nickname').value;
    const profileImageFile = fileInput.files[0];

    console.log('email:', email);
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    console.log('nickname:', nickname);
    console.log('profileImageFile:', profileImageFile);

    // 프로필 사진 확인
    if (!profileImageFile) {
        alert('프로필 사진을 업로드해주세요.');
        return;
    }

    // 이메일 검증
    if (!validateEmail(email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
    }

    // 비밀번호 검증
    if (!validatePassword(password)) {
        alert(
            '비밀번호는 8-20자 사이이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 합니다.',
        );
        return;
    }

    // 비밀번호 확인 일치 검증
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 닉네임 검증
    if (!validateNickname(nickname)) {
        alert('닉네임은 공백없이 10글자 이내여야 합니다.');
        return;
    }

    // 닉네임 중복 확인
    try {
        const checkNicknameResponse = await fetch(
            `${API_BASE_URL}/auth/check-nickname?nickname=${nickname}`,
        );
        const checkNicknameData = await checkNicknameResponse.json();

        if (!checkNicknameResponse.ok || checkNicknameData.exists) {
            alert('이미 사용 중인 닉네임입니다.');
            return;
        }

        const checkEmailResponse = await fetch(
            `${API_BASE_URL}/auth/check-email?email=${email}`,
        );
        const checkEmailData = await checkEmailResponse.json();

        if (!checkEmailResponse.ok || checkEmailData.exists) {
            alert('이미 사용 중인 이메일입니다.');
            return;
        }

        // FormData 객체 생성 및 데이터 추가
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('nickname', nickname);
        formData.append('img', profileImageFile);

        // 회원가입 요청 수정
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || '회원가입에 실패했습니다.');
        }

        alert('회원가입이 완료되었습니다!');
        window.location.href = '/login';
    } catch (error) {
        alert(error.message);
        console.error('회원가입 에러:', error);
    }
});
