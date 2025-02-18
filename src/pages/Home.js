// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';
import { useHomeData } from '../hooks/useHome';
import '../styles/Home.css';
import advertisementBanner from '../assets/advertisement_banner.jpg';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { homeData, loading, error } = useHomeData();

  // 찜 목록 state
  const [wishlistItems, setWishlistItems] = useState(new Set());

  const categories = [
    { name: "Phones", icon: "\ud83d\udcf1" },
    { name: "Computers", icon: "\ud83d\udcbb" },
    { name: "SmartWatch", icon: "\u231a" },
    { name: "Camera", icon: "\ud83d\udcf7" },
    { name: "전기", icon: "\ud83c\udfa7" },
    { name: "기타", icon: "\ud83c\udfae" }
  ];

  // 마운트 시 내 위시리스트 불러오기
  useEffect(() => {
    if (!user || !user.email || !user.accessToken) return;

    getWishlistItems(0, 999, {
      email: user.email,
      accessToken: user.accessToken,
    })
        .then((res) => {
          const pdtIds = res.wishlist?.map((w) => w.pdtId) || [];
          setWishlistItems(new Set(pdtIds));
        })
        .catch((err) => console.error('위시리스트 로딩 오류:', err));
  }, [user]);

  // 찜하기/취소 버튼
  const handleToggleWishlist = async (item) => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    const email = user.email;
    try {
      if (wishlistItems.has(item.itemId)) {
        // 찜 취소
        await toggleWishdel(email, item.itemId);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.itemId);
          return newSet;
        });
        alert('위시리스트에서 제거되었습니다!');
      } else {
        // 찜 등록
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

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams();
    params.set('category', category);
    params.set('page', '0'); // 첫 페이지로 이동
    navigate(`/items?${params.toString()}`); // 카테고리 데이터 가져오기
  };

  if (loading) {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
    );
  }

  if (error) {
    return (
        <Container className="py-5 text-center">
          <h3>데이터를 불러오는데 실패했습니다.</h3>
          <p className="text-muted">잠시 후 다시 시도해주세요.</p>
        </Container>
    );
  }

  return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            {/* 🔸 배너 부분 */}
            <div className="banner mb-4">
              {/* 원래 이미지가 깨졌다면? => 아래처럼 넣거나, 다른 스타일로 대체 */}
              <img src={advertisementBanner} alt="iPhone 14 Series" />
              <div className="banner-overlay">
                <div className="apple-logo">
                  <span>iPhone 14 Series</span>
                </div>
                <h2>Up to 10% off Voucher</h2>
                <Button variant="outline-light">Shop Now →</Button>
              </div>
            </div>

            {/* 추천상품 */}
            <div className="section-header d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <div className="red-marker"></div>
                <h4 className="mb-0 text-start">Today's 추천 상품</h4>
              </div>
            </div>

            <div className="product-grid mb-4">
              {homeData.recentItems.slice(0, 4).map((item) => (
                  <div key={item.itemId} className="product-grid-item">
                    <div className="product-poster">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="product-info">
                      <h6>
                        <Link to={`/items/${item.itemId}`} className="product-title-link">
                          {item.title}
                        </Link>
                      </h6>
                      <div className="price-info">
                        <span className="current-price">가격: \{item.itemprice} </span>
                      </div>
                      <Button
                          className="add-to-like-btn"
                          style={{ backgroundColor: 'black', borderColor: 'black' }}
                          onClick={() => handleToggleWishlist(item)}
                      >
                        {wishlistItems.has(item.itemId) ? '찜취소' : '찜해두기'}
                      </Button>
                    </div>
                  </div>
              ))}
            </div>

            <Button className="more-button" onClick={() => navigate('/items')}>
              더보기
            </Button>

            <div className="divider"></div>

            <section className="categories">
              <h3 className="text-start">Browse By Category</h3>
              <div className="category-grid">
                {categories.map((category, index) => (
                    <div key={index} className="category-item">
                      <span>{category.icon}</span>
                      <Link to={`/items?category=${category.name}`} className="category-link">{category.name}</Link>
                    </div>
                    ))}
                </div>
            </section>
          </Col>
        </Row>
      </Container>
  );
}

export default Home;
