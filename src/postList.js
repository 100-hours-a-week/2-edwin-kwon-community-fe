import utils from './utils.js';
import { API_BASE_URL } from './env.js';
import { PUBLIC_URL } from './env.js';
import { loginState, checkLoginStatus } from './header.js';

const api = {
    // 게시글 목록 조회
    async getPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch posts');
            return await response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },
};

// DOM 조작 관련 함수들
const domHandler = {
    // 게시글 HTML 생성
    async createPostElement(post) {
        const postUrl = `/posts/${post.post_id}`;
        return `
            <a href="${postUrl}" div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-title">${post.title}</div>
                    <div class="post-stats">
                        <span class="likes">좋아요 ${utils.formatNumber(post.like_cnt)}</span>
                        <span class="comments">댓글 ${utils.formatNumber(post.comment_cnt)}</span>
                        <span class="views">조회수 ${utils.formatNumber(post.view_cnt)}</span>
                        <span class="post-date">${utils.formatDate(post.created_at)}</span>
                    </div>
                </div>
                <div class="user-info">
                    <div class="user-avatar" style="background-image: url(${PUBLIC_URL}${post.img})"></div>
                    <div class="user-name">${post.nickname}</div>
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
};

// 게시글 목록 로드
async function loadPosts() {
    try {
        const posts = await api.getPosts();
        domHandler.renderPosts(posts);
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', async function () {
    // loginState가 없는 경우에만 checkLoginStatus 호출
    if (!loginState) {
        await checkLoginStatus();
    }

    // 초기 게시글 로드
    loadPosts();

    // 게시글 작성 버튼 클릭 이벤트
    const writeButton = document.querySelector('.write-button');
    writeButton.addEventListener('click', () => {
        if (!loginState.isLoggedIn) {
            window.location.href = '/login';
            return;
        }
        window.location.href = '/posts/make';
    });
});

// 에러 처리를 위한 전역 핸들러
window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection:', event.reason);
    alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
});

// 뒤로가기 감지 및 페이지 새로고침
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        // bfcache로부터 복원된 경우 (뒤로가기/앞으로가기)
        window.location.reload();
    }
});
