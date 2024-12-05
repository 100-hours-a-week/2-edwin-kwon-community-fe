import { API_BASE_URL, PUBLIC_URL } from './env.js';

document.addEventListener('DOMContentLoaded', function () {
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');

    // 프로필 정보 가져오기
    async function checkLoginStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/img`, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // 로그인 상태: 프로필 메뉴 활성화
                profileIcon.style.backgroundImage = data.img
                    ? `url(${PUBLIC_URL}${data.img})`
                    : `url(${PUBLIC_URL}/images/default-profile.png)`;
                // 프로필 아이콘 클릭 시 드롭다운 메뉴 표시
                profileIcon.addEventListener('click', function (e) {
                    dropdownMenu.classList.toggle('hidden');
                });
            } else {
                // 비로그인 상태: 로그인 페이지로 이동하는 이벤트 추가
                profileIcon.style.backgroundImage = null;
                profileIcon.addEventListener('click', function () {
                    window.location.href = '/login';
                });
            }
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    }

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
    logoutBtn.addEventListener('click', async function () {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    });

    // 초기 로그인 상태 확인
    checkLoginStatus();
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
