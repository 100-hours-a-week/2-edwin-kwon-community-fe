import { API_BASE_URL, PUBLIC_URL } from './env.js';

// 로그인 상태를 저장할 전역 변수
export let loginState = null;

export async function checkLoginStatus() {
    // 이미 상태를 확인했다면 저장된 상태를 반환
    if (loginState !== null) {
        return loginState;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/img`, {
            credentials: 'include',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });

        if (response.ok) {
            const data = await response.json();
            loginState = { isLoggedIn: true, data };
            updateHeaderUI(loginState); // 헤더 UI 업데이트
            return loginState;
        } else {
            loginState = { isLoggedIn: false };
            updateHeaderUI(loginState); // 헤더 UI 업데이트
            return loginState;
        }
    } catch (error) {
        console.error('프로필 로딩 실패:', error);
        loginState = { isLoggedIn: false, error };
        updateHeaderUI(loginState); // 헤더 UI 업데이트
        return loginState;
    }
}

// 헤더 UI 업데이트 함수
function updateHeaderUI(state) {
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // 기존 이벤트 리스너 제거
    const oldProfileIcon = profileIcon.cloneNode(true);
    profileIcon.parentNode.replaceChild(oldProfileIcon, profileIcon);

    if (state.isLoggedIn) {
        oldProfileIcon.style.backgroundImage = `url(${state.data.img})`;
        oldProfileIcon.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            const isHidden = dropdownMenu.classList.contains('hidden');
            if (isHidden) {
                dropdownMenu.classList.remove('hidden');
            } else {
                dropdownMenu.classList.add('hidden');
            }
        });
    } else {
        oldProfileIcon.style.backgroundImage = `url(${PUBLIC_URL}/uploads/profiles/default.jpg)`;
        oldProfileIcon.addEventListener('click', function () {
            window.location.href = '/login';
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');

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
                // 캐시 제어를 위한 헤더 설정
                window.location.replace('/login');
                // 브라우저 히스토리에서 현재 페이지 제거
                window.history.pushState(null, '', '/login');
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
        코코아
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
