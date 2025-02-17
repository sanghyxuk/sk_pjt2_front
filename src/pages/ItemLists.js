import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useHomeData } from '../hooks/useHome';
import { toggleWish, toggleWishdel } from '../api/wishlistApi';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemLists.css';

function ItemLists() {
  // 홈 데이터와 검색 핸들러를 가져옵니다.
  const { homeData, handleSearch, loading } = useHomeData();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  // 검색어와 현재 페이지 상태를 정의합니다.
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(4);
  const [itemsPerPage] = useState(6); // 페이지당 아이템 수 조정
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // 위시리스트에 아이템 추가 또는 제거하는 함수
  const handleAddToWishlist = async (item) => {
    const email = user?.email;
    try {
      if (wishlistItems.has(item.itemId)) {
        await toggleWishdel(email, item.itemId);
        setWishlistItems((prev) => {
          const newWishlist = new Set(prev);
          newWishlist.delete(item.itemId);
          return newWishlist;
        });
        alert("위시리스트에서 제거되었습니다!");
      } else {
        await toggleWish(email, item.itemId, item.title, item.itemprice);
        setWishlistItems((prev) => new Set(prev).add(item.itemId));
        alert("위시리스트에 추가되었습니다!");
      }
    } catch (error) {
      console.error("위시리스트 처리 중 오류 발생:", error);
      alert("위시리스트 처리 중 오류가 발생했습니다.");
    }
  };

  // 페이지가 변경될 때마다 검색을 실행합니다.
  useEffect(() => {
    handleSearch(searchTerm, currentPage);
  }, [location.search, user]);

  // 검색 실행 함수
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
      params.set('page', '0');
      navigate(`/items?${params.toString()}`);
    } else {
      navigate('/items');
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
  };

  return (
      <Container className="py-5" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 className="mb-4">모든 상품</h2>

        {/* 검색 폼 */}
        <Form onSubmit={handleSearchSubmit} className="mb-4">
          <Row className="align-items-center">
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
          <Button variant="primary" onClick={() => navigate('/items/write')} style={{ minWidth: "150px" }}>
            상품등록하기
          </Button>
        </div>

        {/* 카드 형식의 상품 목록 */}
        <div className="product-list">
          {Array.isArray(homeData.searchResults) && homeData.searchResults.length > 0 ? (
              homeData.searchResults.map((item) => (
                  <div className="product-card" key={item.itemId}>
                    <Link to={`/items/${item.itemId}`}>
                      <img src={item.image || 'default-image-url.jpg'} alt={item.title} />
                      <h5>{item.title}</h5>
                      <div className="price">\{item.itemprice}</div>
                    </Link>
                    <Button className="btn-add-to-cart" onClick={() => handleAddToWishlist(item)}>
                      {wishlistItems.has(item.itemId) ? "찜취소" : "찜해두기"}
                    </Button>
                  </div>
              ))
          ) : (
              searchTerm.trim() !== '' && (
                  <div className="text-center py-4">
                    검색된 상품이 없습니다.
                  </div>
              )
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
