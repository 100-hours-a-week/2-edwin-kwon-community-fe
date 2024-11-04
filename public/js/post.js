import utils from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = window.location.pathname.split('/').pop(); // URL에서 post_id 추출
    try {
        const response = await fetch(`http://localhost:8000/post/${postId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const post = await response.json();

        const userResponse = await fetch(
            `http://localhost:8000/users/${post.writer_id}`,
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
            post.write_time,
        );
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});
