import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaThumbsUp, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
//import { postsAPI } from '../api/posts';
import { items } from '../data/dummyData'; // 더미 데이터 import
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemDetail.css';
import { hasDeletePermission } from '../utils/authUtils';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentList.slice(indexOfFirstComment, indexOfLastComment);
  const totalCommentPages = Math.ceil(commentList.length / commentsPerPage);

  const handleCommentPageChange = (pageNumber) => {
    setCurrentCommentPage(pageNumber);
  };

  // 더미 데이터에서 item 가져오기
  useEffect(() => {
    const fetchedItem = items.find(item => item.itemId === parseInt(id));
    if (fetchedItem) {
      setItem(fetchedItem);
      setLikeCount(fetchedItem.heart || 0);
      // 댓글 예시 데이터 추가
      setCommentList([
        { commentId: 1, userId: 1, nickname: "작성자 1", content: "첫 번째 댓글입니다.", created: "2022-01-02" },
        { commentId: 2, userId: 2, nickname: "작성자 2", content: "두 번째 댓글입니다.", created: "2022-01-03" },
      ]);
    }
  }, [id]);

  /*
  const checkUserInteractions = async () => {
    if (!user || !item) return;

    try {
      const likeStatus = await postsAPI.checkLikeStatus(Number(items.itemId), user.id);
      setIsLiked(likeStatus);

      if (items.username) {
        const followStatus = await postsAPI.checkFollowStatus(user.id, post.username);
        setIsFollowing(followStatus);
      }
    } catch (error) {
      console.error('Error checking user interactions:', error);
      const savedLikeStatus = localStorage.getItem(`like_${user.id}_${post.postId}`);
      const savedFollowStatus = localStorage.getItem(`follow_${user.id}_${post.username}`);

      if (savedLikeStatus !== null) {
        setIsLiked(savedLikeStatus === 'true');
      }
      if (savedFollowStatus !== null) {
        setIsFollowing(savedFollowStatus === 'true');
      }
    }
  };

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const isBack = navigationEntries.length > 0 &&
        navigationEntries[0].type === "back_forward";
    setIsBackNavigation(isBack);

    fetchPostData();
  }, [id]);

  const fetchPostData = async () => {
    try {
      const response = await postsAPI.getPostDetail(id, isBackNavigation);
      if (response?.data) {
        const postData = response.data.post;
        const userData = response.data.postUser;

        setPost({
          ...postData,
          userId: Number(postData.userId),
          username: userData?.id,
          nickname: userData?.nickname || '알 수 없음',
          files: postData.files || []
        });

        setLikeCount(postData.heart || 0);

        const commentsData = response.data.comment || [];
        const commentUsers = response.data.commentUser || [];

        const commentsWithUserInfo = commentsData.map((comment, index) => ({
          ...comment,
          userId: Number(comment.userId),
          nickname: commentUsers[index]?.nickname || '알 수 없음'
        }));

        setCommentList(commentsWithUserInfo);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    checkUserInteractions();
  }, [user, post]);

  const canDeletePost = () => {
    return hasDeletePermission(user, post.userId);
  };

  const canDeleteComment = (comment) => {
    return hasDeletePermission(user, comment.userId);
  };

  const handleDelete = async () => {
    if (!canDeletePost()) return;

    try {
      await postsAPI.deletePost(id, user);
      navigate('/items');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await postsAPI.createComment(newComment.trim(), id, user.id);
      setNewComment('');
      fetchPostData();
    } catch (error) {
      console.error('Comment submit error:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleEditSubmit = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await postsAPI.updateComment(commentId, editCommentContent.trim());
      setEditingCommentId(null);
      setEditCommentContent('');
      fetchPostData();
    } catch (error) {
      console.error('Comment update error:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await postsAPI.deleteComment(commentId, user);
      const updatedComments = commentList.filter(comment => comment.commentId !== commentId);
      setCommentList(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await postsAPI.likePost(post.postId, user.id);
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      localStorage.setItem(`like_${user.id}_${post.postId}`, newIsLiked);
    } catch (error) {
      console.error('Error liking post:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await postsAPI.followUser(post.username);
      if (response.status === 200) {
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        alert(newIsFollowing ? '팔로우 되었습니다.' : '팔로우가 취소되었습니다.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('팔로우 처리 중 오류가 발생했습니다.');
    }
  };
  */

  if (!item) return <div>로딩 중...</div>;

  return (
      <Container className="py-5">
        <Row>
          <Col md={8}>
            <Card className="item-card">
              <Card.Header>
                <div className="item-header">
                  <h4>{item.title}</h4>
                  <div className="item-meta">
                    <span className="item-date">{item.created}</span>
                    <span className="item-views">조회수: {item.cnt}</span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="item-content">
                  {item.fileAttached === 1 && item.files && item.files.length > 0 && (
                      <div className="item-images mt-3">
                        {item.files.map((filePath, index) => (
                            <div key={index} className="mb-3">
                              <img
                                  src={`http://localhost:8080/uploads/${filePath}`}
                                  alt={`첨부 이미지 ${index + 1}`}
                                  className="img-fluid"
                              />
                            </div>
                        ))}
                      </div>
                  )}
                  <p>{item.content}</p>
                </div>
                <div className="like-section">
                  <Button
                      variant={isLiked ? "primary" : "outline-primary"}
                      onClick={() => {
                        setIsLiked(!isLiked);
                        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                      }}
                      className="like-btn"
                  >
                    <FaHeart /> {likeCount}
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-end gap-3">
                  <Button variant="secondary" onClick={() => navigate('/items')}>
                    목록
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="comments-section">
              <Card.Header>
                <h5 className="mb-0">댓글 {commentList.length}개</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {user && (
                    <div className="comment-form">
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        if (newComment.trim()) {
                          setCommentList([...commentList, { commentId: commentList.length + 1, userId: user.id, nickname: user.nickname, content: newComment, created: new Date().toLocaleDateString() }]);
                          setNewComment('');
                        }
                      }}>
                        <Form.Group>
                          <Form.Control
                              as="textarea"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="댓글을 입력하세요"
                          />
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-2">
                          <Button type="submit" variant="primary">댓글 작성</Button>
                        </div>
                      </Form>
                    </div>
                )}

                {commentList.map((comment) => (
                    <div key={comment.commentId} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <strong>{comment.nickname}</strong>
                          <span className="comment-date">{comment.created}</span>
                        </div>
                        {user && user.id === comment.userId && (
                            <div className="comment-buttons">
                              <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => setCommentList(commentList.filter(c => c.commentId !== comment.commentId))}
                              >
                                삭제
                              </Button>
                            </div>
                        )}
                      </div>
                      <div className="comment-content">
                        {comment.content}
                      </div>
                    </div>
                ))}

                {commentList.length === 0 && (
                    <p className="text-center text-muted py-4">첫 번째 댓글을 작성해보세요!</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

export default ItemDetail;