import utils from './utils.js';
import API_BASE_URL from './env.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = window.location.pathname.split('/').pop(); // URL에서 post_id 추출
    const commentInput = document.getElementById('comment-input');
    const submitCommentButton = document.getElementById('submit-comment');
    const commentsSection = document.getElementById('comments-section');
    const deleteButton = document.getElementById('delete-button');
    const postDeleteModal = document.getElementById('postDeleteModal');
    const confirmPostDeleteButton = document.getElementById(
        'confirmPostDeleteButton',
    );
    const cancelPostDeleteButton = document.getElementById(
        'cancelPostDeleteButton',
    );

    deleteButton.addEventListener('click', e => {
        e.preventDefault();
        postDeleteModal.classList.add('show');
    });

    cancelPostDeleteButton.addEventListener('click', () => {
        postDeleteModal.classList.remove('show');
    });

    confirmPostDeleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('게시글 삭제에 실패했습니다.');

            window.location.href = '/'; // 삭제 후 메인 페이지로 이동
        } catch (error) {
            console.error('게시글 삭제 중 오류:', error);
        }
        postDeleteModal.classList.remove('show');
    });

    // 전역 스코프에서 editComment와 deleteComment 함수 정의
    window.editComment = async commentId => {
        try {
            const newContent = prompt('댓글을 수정하세요:');
            if (!newContent) return;

            const response = await fetch(
                `${API_BASE_URL}/comments/${commentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: newContent,
                    }),
                },
            );

            if (!response.ok) throw new Error('댓글 수정에 실패했습니다.');
            await loadComments(postId);
        } catch (error) {
            console.error('댓글 수정 중 오류:', error);
        }
    };

    window.deleteComment = async commentId => {
        const commentDeleteModal =
            document.getElementById('commentDeleteModal');
        const confirmCommentDeleteButton = document.getElementById(
            'confirmCommentDeleteButton',
        );
        const cancelCommentDeleteButton = document.getElementById(
            'cancelCommentDeleteButton',
        );

        // 모달 표시
        commentDeleteModal.classList.add('show');

        // 이벤트 리스너 설정
        const handleDelete = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/posts/${postId}/comments/${commentId}`,
                    {
                        method: 'DELETE',
                    },
                );

                if (!response.ok) throw new Error('댓글 삭제에 실패했습니다.');
                await loadComments(postId);
            } catch (error) {
                console.error('댓글 삭제 중 오류:', error);
            } finally {
                commentDeleteModal.classList.remove('show');
                // 이벤트 리스너 제거
                confirmCommentDeleteButton.removeEventListener(
                    'click',
                    handleDelete,
                );
                cancelCommentDeleteButton.removeEventListener(
                    'click',
                    handleCancel,
                );
            }
        };

        const handleCancel = () => {
            commentDeleteModal.classList.remove('show');
            // 이벤트 리스너 제거
            confirmCommentDeleteButton.removeEventListener(
                'click',
                handleDelete,
            );
            cancelCommentDeleteButton.removeEventListener(
                'click',
                handleCancel,
            );
        };

        // 버튼에 이벤트 리스너 추가
        confirmCommentDeleteButton.addEventListener('click', handleDelete);
        cancelCommentDeleteButton.addEventListener('click', handleCancel);
    };

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

        // 좋아요 버튼 업데이트
        const likeButton = document.getElementById('like-button');
        likeButton.innerText = `${utils.formatNumber(post.like_cnt)}\n 좋아요수`;
        likeButton.addEventListener('click', () => toggleLike(postId));

        // 텍스트와 함께 숫자를 표시
        document.getElementById('view-count').innerText =
            `${utils.formatNumber(post.view_cnt)}\n 조회수`;
        document.getElementById('comment-cnt').innerText =
            `${utils.formatNumber(post.comment_cnt)}\n 댓글`;

        document.getElementById('post-author').innerText = user.nickname;
        document.getElementById('post-date').innerText = utils.formatDate(
            post.created_at,
        );

        // 댓글 로딩
        await loadComments(postId);

        // 댓글 등록 이벤트 리스너
        submitCommentButton.addEventListener('click', async () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                await submitComment(postId, commentText);
                commentInput.value = ''; // 입력란 초기화
                await loadComments(postId); // 댓글 다시 로딩
            }
        });
    } catch (error) {
        console.error('Error fetching post:', error);
    }

    // 댓글 로딩 함수
    async function loadComments() {
        try {
            const commentsResponse = await fetch(
                `${API_BASE_URL}/posts/${postId}/comments/`,
            );
            if (!commentsResponse.ok) {
                throw new Error('댓글을 불러오는 데 실패했습니다.');
            }
            const comments = await commentsResponse.json();

            // 댓글 섹션 초기화
            commentsSection.innerHTML = '';

            // 각 댓글에 대해 HTML 생성
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-user-info">
                            <div class="user-avatar">
                            <img src="${comment.profile_img}" class="avatar">
                        </div>
                        <span class="comment-author">${comment.nickname}</span>
                        <span class="comment-date">${utils.formatDate(comment.created_at)}</span>
                    </div>
                        <div class="comment-actions">
                        <button onclick="editComment(${comment.comment_id})">수정</button>
                        <button onclick="deleteComment(${comment.comment_id})">삭제</button>
                        </div>
                    </div>
                    <div class="comment-text">${comment.content}</div>
                `;
                commentsSection.appendChild(commentElement);
            });

            // 댓글 수 업데이트
            document.getElementById('comment-cnt').innerText =
                `${utils.formatNumber(comments.length)}\n 댓글`;
        } catch (error) {
            console.error('댓글 로딩 중 오류:', error);
        }
    }

    // 댓글 제출 함수
    async function submitComment(postId, commentText) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/posts/${postId}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: commentText,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('댓글 등록에 실패했습니다.');
            }

            return await response.json();
        } catch (error) {
            console.error('댓글 제출 중 오류:', error);
        }
    }

    // 댓글 수정 모드
    function enterEditMode(commentId, commentText) {
        const commentInput = document.getElementById('comment-input');
        const submitButton = document.getElementById('submit-comment');
        const editingCommentId = document.getElementById('editing-comment-id');

        commentInput.value = commentText;
        submitButton.textContent = '댓글 수정';
        submitButton.classList.add('edit-mode');
        editingCommentId.value = commentId;

        // 스크롤을 댓글 입력창으로 이동
        commentInput.scrollIntoView({ behavior: 'smooth' });
    }

    // 댓글 수정 제출
    async function updateComment(commentId, newContent) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/${commentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: newContent }),
                },
            );
            // 성공 처리
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    }

    // 좋아요 기능
    async function toggleLike(postId) {
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            const likeButton = document.getElementById('like-button');
            likeButton.textContent = `${data.likeCount} 좋아요`;
            likeButton.classList.toggle('liked', data.isLiked);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    }
});
