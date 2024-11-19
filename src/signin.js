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
