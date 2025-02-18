import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaThumbsUp, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
//import { items } from '../data/dummyData'; // 더미 데이터 import
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
    if (true) {
      // 댓글 예시 데이터 추가
      setCommentList([
        { commentId: 1, userId: 1, nickname: "작성자 1", content: "첫 번째 후기입니다.", created: "2022-01-02" },
        { commentId: 2, userId: 2, nickname: "작성자 2", content: "두 번째 후기입니다.", created: "2022-01-03" },
      ]);
    }
  }, [id]);


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
      console.log("response: " + JSON.stringify(response.data, null, 2));
      console.log(user);
      setItem(response.data);

    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  if (!item) return <div>로딩 중...</div>;

  return (
      <Container className="py-5" style={{ display: 'flex', flexDirection: 'column' }}>
        <Row className="d-flex flex-row flex-nowrap justify-content-between align-items-start">
          <Col md={6}>
            <Card className="item-card">
              <Card.Body>
                <div className="item-images">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                      item.imageUrls.map((filePath, index) => (
                          <div key={index} className="mb-3">
                            <img
                                src={filePath}
                                alt={`첨부 이미지 ${index + 1}`}
                                className="img-fluid"
                            />
                          </div>
                      ))
                  ) : null}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="item-card">
              <Card.Body>
                <h4>{item.pdtName}</h4>
                <h3 className="item-price">\{item.pdtPrice}</h3>
                <p>{item.description}</p>

                <div className="divider"></div>

                <div className="like-section">
                  <Button
                      variant={isLiked ? "primary" : "outline-primary"}
                      onClick={() => {
                        setIsLiked(!isLiked);
                        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                      }}
                      className="like-btn"
                  >
                    찜하기
                    <FaHeart/> {likeCount}
                  </Button>
                </div>
                <div className="action-buttons mt-3">
                  <Button variant="success">배달 \3000</Button>
                  <Button variant="success">직거래</Button>
                  <div>
                    <Button variant="primary" className="me-2" onClick={() => navigate('/chat')}>
                      채팅하기
                    </Button>
                  </div>
                  <div>
                    <Button variant="primary" className="me-2" onClick={() => postsAPI.deleteItem(item.pdtId, user)}>
                      상품삭제
                    </Button>
                  </div>
                </div>
                <div className="item-meta">
                  <span className="item-date">2020.2.2.</span>
                  <span className="item-views">조회수: 3</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

export default ItemDetail;