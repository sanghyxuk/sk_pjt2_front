import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemLists.css';
import dummyItems from '../data/dummyItems';

function ItemLists() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const [posts, setPosts] = useState([]);
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'title');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const searchQuery = currentParams.get('search');
    const searchTypeQuery = currentParams.get('type');
    const pageQuery = parseInt(currentParams.get('page'));

    if (location.pathname === '/community' && !location.search) {
      setSearchTerm('');
      setSearchType('title');
      setCurrentPage(0);
      loadPosts(0);
      return;
    }
//
    setSearchTerm(searchQuery || '');
    setSearchType(searchTypeQuery || 'title');
    setSearchType(searchTypeQuery || 'title');
    setCurrentPage(pageQuery || 0);

    if (searchQuery) {
      loadPosts(pageQuery || 0, searchQuery, searchTypeQuery);
    } else {
      loadPosts(pageQuery || 0);
    }
  }, [location.pathname, location.search]);

  const loadPosts = async (page, search = '', type = 'title') => {
    // 페이지네이션 로직을 위해 페이지당 아이템 수를 고려하여 데이터 슬라이스
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPosts = dummyItems.slice(startIndex, endIndex);

    setPosts(paginatedPosts);
    setTotalPages(Math.ceil(dummyItems.length / itemsPerPage));
  };

  /*
  const loadPosts = async (page, search = '', type = 'title') => {
    try {
      let response;
      if (search) {
        response = await postsAPI.searchPosts(search.trim(), page, itemsPerPage, type);
      } else {
        response = await postsAPI.getPostsList(page, itemsPerPage);
      }

      if (response?.data) {
        const postsData = response.data.post.content;
        const userData = response.data.user;

        const postsWithUserInfo = postsData.map((post, index) => ({
          ...post,
          nickname: userData[index]?.nickname || '알 수 없음'
        }));

        setPosts(postsWithUserInfo);
        setTotalPages(response.data.post.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
      setTotalPages(0);
    }
  };
  */

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
      params.set('page', '0');
      navigate(`/community?${params.toString()}`);
    } else {
      navigate('/community');
    }
  };

  const handlePageChange = async (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
    window.scrollTo(0, 0);

    const searchQuery = params.get('search');
    const searchTypeQuery = params.get('type');

    if (searchQuery) {
      await loadPosts(pageNumber - 1, searchQuery, searchTypeQuery);
    } else {
      await loadPosts(pageNumber - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/community/write');
  };

  return (
      <Container className="py-5">
        <h2 className="mb-4">모든 상품</h2>

        {/* 검색 폼 */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mb-2 mb-md-0"
              >
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="titleContent">제목+내용</option>
                <option value="author">작성자</option>
              </Form.Select>
            </Col>
            <Col md={9}>
              <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  <FaSearch /> 검색
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>

        {/* 글쓰기 버튼 */}
        <div className="d-flex justify-content-end mb-3">
          {user && (
              <Button variant="primary" onClick={handleWriteClick}>
                글쓰기
              </Button>
          )}
        </div>

        {/* 카드 형식의 상품 목록 */}
        <div className="product-list">
          {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                  <div className="card" key={post.postId}>
                    {post.discount && (
                        <div className="discount">-{post.discount}%</div>
                    )}
                    <Link to={`/community/${post.postId}`}>
                      <img src={post.imageUrl || 'default-image-url.jpg'} alt={post.title} />
                      <h5>{post.title}</h5>
                      <div className="price">${post.price}</div>
                      <div className="rating">⭐ {post.rating || 0}</div>
                    </Link>
                    <Button className="btn-add-to-cart">Add To Cart</Button>
                  </div>
              ))
          ) : (
              <div className="text-center py-4">
                게시글이 없습니다.
              </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
            <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}
      </Container>
  );
}

export default ItemLists;
