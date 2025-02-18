// src/pages/ItemLists.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// 🔥 위시리스트 API
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';

// 홈데이터 훅 (상품 검색)
import { useHomeData } from '../hooks/useHome';

// 페이지네이션 컴포넌트
import Pagination from '../components/Pagination';

import '../styles/common.css';
import '../styles/ItemLists.css';

function ItemLists() {
  // 홈데이터 훅에서, 검색결과 / handleSearch / totalPages 등을 가져옵니다.
  const { homeData, handleSearch, loading, totalPages, fetchCategoryData } = useHomeData();

  // 로그인 사용자 정보
  const { user } = useAuth();

  // 라우터 관련
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 검색어와 현재 페이지 (0-based)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(
      parseInt(searchParams.get('page')) || 0
  );

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

  // 2) 검색 로직: location.search or user 바뀔 때 handleSearch
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      fetchCategoryData(category, currentPage); // 카테고리 데이터 가져오기
    } else {
      handleSearch(searchTerm, currentPage);
    }
  }, [location.search, user]);

  // 검색 제출
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

  // 페이지네이션 변경
  const handlePageChange = (pageNumber) => {
    const newPageIndex = pageNumber - 1; // 백엔드가 0-based
    const params = new URLSearchParams(location.search);
    params.set('page', newPageIndex);
    navigate(`${location.pathname}?${params.toString()}`);

    setCurrentPage(newPageIndex);
  };

  // 3) 찜하기/취소 버튼 로직
  const handleAddToWishlist = async (item) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    const email = user.email;
    try {
      if (wishlistItems.has(item.itemId)) {
        // 찜취소
        await toggleWishdel(email, item.itemId);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.itemId);
          return newSet;
        });
        alert('위시리스트에서 제거되었습니다!');
      } else {
        // 찜하기
        await toggleWish(email, item.itemId, item.title, item.itemprice);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(item.itemId);
          return newSet;
        });
        alert('위시리스트에 추가되었습니다!');
      }
    } catch (error) {
      console.error('위시리스트 처리 중 오류 발생:', error);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryClick = async (category) => {
    const params = new URLSearchParams();
    params.set('category', category);
    params.set('page', '0'); // 첫 페이지로 이동
    navigate(`/items?${params.toString()}`);
    await fetchCategoryData(category);
  };

  return (
      <Container className="py-5" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 className="mb-4">모든 상품</h2>

        {/* 카테고리 버튼 */}
        <div className="mb-4">
          {['Phones', 'Computers', 'SmartWatch', 'Camera', '전기', '기타'].map(category => (
              <Button
                  key={category}
                  variant="secondary"
                  onClick={() => handleCategoryClick(category)}
                  className="me-2"
              >
                {category}
              </Button>
          ))}
        </div>

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
          <Button
              variant="primary"
              onClick={() => navigate('/items/write')}
              style={{ minWidth: '150px' }}
          >
            상품등록하기
          </Button>
        </div>

        {/* 상품 목록 */}
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
                      {wishlistItems.has(item.itemId) ? '찜취소' : '찜해두기'}
                    </Button>
                  </div>
              ))
          ) : (
              searchTerm.trim() !== '' && (
                  <div className="text-center py-4">검색된 상품이 없습니다.</div>
              )
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
            <Pagination
                currentPage={currentPage + 1} // 1-based
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}
      </Container>
  );
}

export default ItemLists;
