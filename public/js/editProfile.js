// editProfile.js

function showToastMessage(message) {
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast-message');
    toastElement.textContent = message;

    document.body.appendChild(toastElement);

    setTimeout(() => {
        toastElement.remove();
    }, 3000); // Hide the toast message after 3 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.edit-form');
    const nicknameInput = document.getElementById('nickname');
    const nicknameError = document.getElementById('nicknameError');
    const quitButton = document.getElementById('quitButton');
    const confirmQuitModal = document.getElementById('confirmQuitModal');
    const confirmQuitButton = document.getElementById('confirmQuitButton');
    const cancelQuitButton = document.getElementById('cancelQuitButton');

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

    quitButton.addEventListener('click', () => {
        confirmQuitModal.style.display = 'block';
    });

    confirmQuitButton.addEventListener('click', () => {
        // Handle user quitting/deleting their account
        console.log('회원 탈퇴 처리');
        confirmQuitModal.style.display = 'none';
    });

    cancelQuitButton.addEventListener('click', () => {
        confirmQuitModal.style.display = 'none';
    });
});

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
