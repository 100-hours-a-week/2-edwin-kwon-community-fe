import utils from './utils.js';
import API_BASE_URL from './env.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = window.location.pathname.split('/').pop(); // URL에서 post_id 추출
    const quitButton = document.getElementById('deleteButton');
    const confirmQuitModal = document.getElementById('confirmDelModal');
    const confirmQuitButton = document.getElementById('confirmDelButton');
    const cancelQuitButton = document.getElementById('cancelDelButton');
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const post = await response.json();

        const userResponse = await fetch(
            `${API_BASE_URL}/users/${post.member_id}`,
        );
        if (!userResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const user = await userResponse.json();

        // HTML 요소에 포스트 정보 추가
        document.getElementById('post-title').innerText = post.title;
        document.getElementById('post-content').innerText = post.content;

        // 텍스트와 함께 숫자를 표시
        document.getElementById('like-count').innerText =
            `${utils.formatNumber(post.like_cnt)}\n 좋아요수`;
        document.getElementById('view-count').innerText =
            `${utils.formatNumber(post.view_cnt)}\n 조회수`;
        document.getElementById('comment-cnt').innerText =
            `${utils.formatNumber(post.comment_cnt)}\n 댓글`;

        document.getElementById('post-author').innerText = user.nickname;
        document.getElementById('post-date').innerText = utils.formatDate(
            post.created_at,
        );
    } catch (error) {
        console.error('Error fetching post:', error);
    }
    // 회원 탈퇴 버튼 클릭 시
    quitButton.addEventListener('click', e => {
        e.preventDefault(); // 폼 제출 방지
        confirmQuitModal.classList.add('show'); // show 클래스 추가
    });

    // 취소 버튼 클릭 시
    cancelQuitButton.addEventListener('click', () => {
        confirmQuitModal.classList.remove('show'); // show 클래스 제거
    });

    // 확인 버튼 클릭 시
    confirmQuitButton.addEventListener('click', () => {
        // 회원 탈퇴 처리 로직
        confirmQuitModal.classList.remove('show'); // show 클래스 제거
    });
});
