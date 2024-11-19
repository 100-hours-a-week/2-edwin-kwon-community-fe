document.addEventListener('DOMContentLoaded', function () {
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');

    // 로그인 상태 체크 함수
    function checkLoginStatus() {
        // 예: localStorage나 세션에서 토큰을 확인
        return localStorage.getItem('userToken') !== null;
    }

    // 프로필 아이콘 클릭 이벤트
    profileIcon.addEventListener('click', function (e) {
        dropdownMenu.classList.toggle('hidden');

        // if (checkLoginStatus()) {
        //     // 로그인 상태: 드롭다운 토글
        //     dropdownMenu.classList.toggle('hidden');
        // } else {
        //     // 비로그인 상태: 로그인 페이지로 이동
        //     console.log('로그인 페이지로 이동', window.location.href);
        //     window.location.href = '/login';
        // }
    });

    // 드롭다운 외부 클릭시 닫기
    document.addEventListener('click', function (e) {
        if (
            !profileIcon.contains(e.target) &&
            !dropdownMenu.contains(e.target)
        ) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // 로그아웃 버튼 클릭 이벤트
    logoutBtn.addEventListener('click', function () {
        // 로그아웃 처리
        // localStorage.removeItem('userToken');
        // window.location.href = '/login';
    });
});

const headerHtml = `
    <header class="header">
    <button id="backButton" onclick="window.history.back()">&lt;&emsp;</button>
    <h1 onclick="window.location.href='/'" style="cursor: pointer;">
        아무 말 대잔치
    </h1>
    <div class="profile-container">
        <div class="profile-icon"></div>
        <!-- 드롭다운 메뉴 -->
        <div class="dropdown-menu hidden">
            <ul>
                <li><button onclick="window.location.href='/editProfile'">회원정보수정</button></li>
                <li><button onclick="window.location.href='/editPassword'">비밀번호수정</button></li>
                <li><button id="logout-btn">로그아웃</button></li>
            </ul>
        </div>
    </div>
</header>
`;

export default headerHtml;
