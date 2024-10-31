const API_BASE_URL = 'http://localhost:8000';

// API 호출 관련 함수들
async function fetchNickname(writerId) {
    try {
        const response = await fetch(
            `http://localhost:8000/user-nickname/${writerId}`,
        );
        if (!response.ok) throw new Error('Failed to fetch nickname');

        const data = await response.json();
        console.log('debug : data.', data);
        return data.nickname;
    } catch (error) {
        console.error('Error fetching nickname:', error);
        return 'Unknown'; // 에러 시 기본 값
    }
}

const api = {
    // 게시글 목록 조회
    async getPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/dbtest`);
            if (!response.ok) throw new Error('Failed to fetch posts');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    // 게시글 작성
    async createPost(postData) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Failed to create post');
            return await response.json();
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },
};

// 유틸리티 함수들
const utils = {
    // 숫자 포맷팅
    formatNumber(number) {
        if (number >= 100000) return `${Math.floor(number / 1000)}k`;
        if (number >= 10000) return `${Math.floor(number / 1000)}k`;
        if (number >= 1000) return `${Math.floor(number / 1000)}k`;
        return number.toString();
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date
            .toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
            .replace(/\./g, '-')
            .replace(',', '');
    },
};

// DOM 조작 관련 함수들
const domHandler = {
    // 게시글 HTML 생성
    async createPostElement(post) {
        const nickname = await fetchNickname(post.writer_id);
        const postUrl = `/post/${post.board_id}`;

        return `
            <a href="${postUrl}" div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-title">${post.title}</div>
                    <div class="post-date">${utils.formatDate(post.write_time)}</div>
                </div>
                <div class="post-stats">
                    <span class="likes">좋아요 ${utils.formatNumber(post.like_cnt)}</span>
                    <span class="comments">댓글 ${utils.formatNumber(post.comment_cnt)}</span>
                    <span class="views">조회수 ${utils.formatNumber(post.view_cnt)}</span>
                </div>
                <div class="user-info">
                    <div class="user-avatar"></div>
                    <div class="user-name">${nickname}</div>
                </div>
            </div>
        `;
    },

    // 게시글 목록 렌더링
    async renderPosts(posts) {
        const postsContainer = document.querySelector('.posts');

        // 모든 게시글에 대해 createPostElement 호출을 병렬로 처리
        const postElements = await Promise.all(
            posts.map(post => this.createPostElement(post)),
        );

        // 각 postElements를 합쳐서 HTML에 추가
        postsContainer.innerHTML = postElements.join('');
    },

    // 작성 폼 토글
    toggleWriteForm() {
        const existingForm = document.querySelector('.write-form');
        if (existingForm) {
            existingForm.remove();
            return;
        }

        const writeForm = document.createElement('div');
        writeForm.className = 'write-form';
        writeForm.innerHTML = `
            <input 
                type="text" 
                id="postTitle" 
                maxlength="26" 
                placeholder="제목을 입력하세요 (최대 26자)"
                style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;"
            >
            <button id="submitPost" style="background-color: #ACA0EB; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                작성완료
            </button>
        `;

        const posts = document.querySelector('.posts');
        posts.insertBefore(writeForm, posts.firstChild);

        // 작성완료 버튼 이벤트 리스너
        document
            .getElementById('submitPost')
            .addEventListener('click', async () => {
                const titleInput = document.getElementById('postTitle');
                const title = titleInput.value.trim();

                if (!title) {
                    alert('제목을 입력해주세요.');
                    return;
                }

                try {
                    const newPost = await api.createPost({
                        title,
                        author: '작성자', // 실제로는 로그인된 사용자 정보 사용
                        createdAt: new Date().toISOString(),
                    });

                    await loadPosts(); // 목록 새로고침
                    writeForm.remove();
                } catch (error) {
                    alert('게시글 작성에 실패했습니다.');
                }
            });
    },
};

// 게시글 목록 로드
async function loadPosts() {
    try {
        const posts = await api.getPosts();
        domHandler.renderPosts(posts);
    } catch (error) {
        console.error('Failed to load posts:', error);
        alert('게시글을 불러오는데 실패했습니다.');
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function () {
    // 초기 게시글 로드
    loadPosts();

    // 게시글 작성 버튼 클릭 이벤트
    const writeButton = document.querySelector('.write-button');
    if (writeButton) {
        writeButton.addEventListener('click', () =>
            domHandler.toggleWriteForm(),
        );
    }

    // 호버 효과
    document.addEventListener('mouseover', function (e) {
        if (e.target.classList.contains('write-button')) {
            e.target.style.backgroundColor = '#7F6AEE';
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (e.target.classList.contains('write-button')) {
            e.target.style.backgroundColor = '#ACA0EB';
        }
    });
});

// 에러 처리를 위한 전역 핸들러
window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection:', event.reason);
    alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
});

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
        if (checkLoginStatus()) {
            // 로그인 상태: 드롭다운 토글
            dropdownMenu.classList.toggle('hidden');
        } else {
            // 비로그인 상태: 로그인 페이지로 이동
            console.log('로그인 페이지로 이동', window.location.href);
            window.location.href = '/login';
        }
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
        localStorage.removeItem('userToken');
        window.location.href = '/login';
    });
});
