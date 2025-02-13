import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { items } from '../data/dummyData';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemLists.css';

function ItemLists() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'title');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(4); // 페이지당 아이템 수 조정

  useEffect(() => {
    // 로그인하지 않은 경우, 페이지 내용을 로드하지 않음
    //if (!user) {
    //  return;
    //}

    loadPosts(currentPage); // 현재 페이지에 맞는 포스트 로드
  }, [location.search, user]);

  const loadPosts = (page) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 검색어가 있을 경우 필터링
    const filtered = items.filter(item => {
      if (searchType === 'title') {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'content') {
        return item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'titleContent') {
        return (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())));
      } else if (searchType === 'author') {
        return item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    const paginatedItems = filtered.slice(startIndex, endIndex);
    setFilteredItems(paginatedItems);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // api 사용한 검색
  /*
  const loadPosts = async (page, search = '', type = 'title') => {
    try {
      let response;
      // 검색 쿼리가 있는 경우 API 호출
      if (search) {
        response = await postsAPI.searchPosts(search.trim(), page, itemsPerPage, type);
      } else {
        // 검색 쿼리가 없는 경우 모든 포스트 가져오기
        response = await postsAPI.getPostsList(page, itemsPerPage);
      }

      if (response?.data) {
        const postsData = response.data.post.content;
        const userData = response.data.user;

        // 포스트와 사용자 정보를 결합
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

    // 검색어가 있는 경우, URL 파라미터 설정
    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
      params.set('page', '0');
      navigate(`/items?${params.toString()}`);
    } else {
      navigate('/items');
    }
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
  };

  const handleWriteClick = () => {
    //if (!user) {
    //  alert('로그인이 필요합니다.');
    //  navigate('/login');
    //  return;
    //}
    navigate('/items/write');
  };

  return (
      <Container className="py-5" style={{ display: 'flex', flexDirection: 'column' }}>
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
                <option value="title">상품이름</option>
                <option value="content">내용</option>
                <option value="titleContent">상품이름+내용</option>
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

        {/* 등록하기 버튼 */}
        <div className="d-flex justify-content-end mb-3">
          {(
          //{user && (
              <Button variant="primary" onClick={handleWriteClick}>
                상품등록하기
              </Button>
          )}
        </div>

        {/* 카드 형식의 상품 목록 */}
        <div className="product-list">
          {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                  <div className="product-card" key={item.itemId}>
                    {item.discount && (
                        <div className="discount">-{item.discount}%</div>
                    )}
                    <Link to={`/items/${item.itemId}`}>
                      <img src={item.imageUrl || 'default-image-url.jpg'} alt={item.title} />
                      <h5>{item.title}</h5>
                      <div className="price">${item.price}</div>
                      <div className="rating">⭐ {item.rating || 0}</div>
                    </Link>
                    <Button className="btn-add-to-cart">찜해두기</Button>
                  </div>
              ))
          ) : (
              <div className="text-center py-4">
                상품이 없습니다.
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