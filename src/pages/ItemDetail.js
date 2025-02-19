import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaThumbsUp, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';
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

  // 🔹 페이지 초기화 시 서버에서 내 위시리스트를 불러와서 유지
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // 1) 마운트/유저 바뀔 때 “전체” 찜 목록 GET
  useEffect(() => {
    if (!user || !user.email || !user.accessToken) return;

    getWishlistItems(0, 999, {
      email: user.email,
      accessToken: user.accessToken,
    })
        .then((res) => {
          const itemIds = res.wishlist?.map((w) => w.pdtId) || [];
          setWishlistItems(new Set(itemIds));
        })
        .catch((err) => {
          console.error('위시리스트 로딩 오류:', err);
        });
  }, [user]);

  // 3) 찜하기/취소 버튼 로직
  const handleAddToWishlist = async (item) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    const email = user.email;
    try {
      if (wishlistItems.has(item.pdtId)) {
        // 찜취소
        await toggleWishdel(email, item.pdtId);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.pdtId);
          return newSet;
        });
        alert('위시리스트에서 제거되었습니다!');
      } else {
        // 찜하기
        await toggleWish(email, item.pdtId, item.pdtName, item.pdtPrice);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(item.pdtId);
          return newSet;
        });
        alert('위시리스트에 추가되었습니다!');
      }
    } catch (error) {
      console.error('위시리스트 처리 중 오류 발생:', error);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    }
  };

  // 더미 데이터에서 item 가져오기
  {/*
  useEffect(() => {
    if (true) {
      // 댓글 예시 데이터 추가
      setCommentList([
        { commentId: 1, userId: 1, nickname: "작성자 1", content: "첫 번째 후기입니다.", created: "2022-01-02" },
        { commentId: 2, userId: 2, nickname: "작성자 2", content: "두 번째 후기입니다.", created: "2022-01-03" },
      ]);
    }
  }, [id]);
*/}

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
                  <Button className="btn-add-to-cart" onClick={() => handleAddToWishlist(item)}>
                    <FaHeart/>
                    {wishlistItems.has(item.pdtId) ? ' 찜취소' : ' 찜하기'}
                  </Button>
                </div>


                <div className="action-buttons mt-3">
                  <div>
                    <Button variant="primary" className="me-2" onClick={() => navigate('/chat')}>
                      채팅하기
                    </Button>
                  </div>
                  <div>

                    {user && item && hasDeletePermission(user, item) && (
                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={async () => {
                              const confirmDelete = window.confirm("정말로 상품을 삭제하시겠습니까?");
                              if (!confirmDelete) return;

                              try {
                                await postsAPI.deleteItem(item.pdtId, user);
                                alert("상품이 삭제되었습니다.");
                                navigate(-1);
                              } catch (error) {
                                alert("상품 삭제에 실패했습니다.");
                                console.error(error);
                              }
                            }}
                        >
                          상품삭제
                        </Button>
                    )}


                  </div>
                </div>
                <div className="action-buttons delivery mt-3">
                  <Button variant="success">배달 \3000</Button>
                  <Button variant="success">직거래</Button>
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