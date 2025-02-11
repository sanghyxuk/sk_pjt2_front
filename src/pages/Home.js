import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useHomeData } from '../hooks/useHome';
import '../styles/Home.css';
import advertisementBanner from '../assets/advertisement_banner.jpg';

function Home() {
  const { homeData, loading, error } = useHomeData();

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: "Woman's Fashion", link: "/womens-fashion" },
    { name: "Men's Fashion", link: "/mens-fashion" },
    { name: "Electronics", link: "/electronics" },
    { name: "Home & Lifestyle", link: "/home-lifestyle" },
    { name: "Medicine", link: "/medicine" },
    { name: "Sports & Outdoor", link: "/sports-outdoor" },
    { name: "Baby's & Toys", link: "/baby-toys" },
    { name: "Groceries & Pets", link: "/groceries-pets" },
    { name: "Health & Beauty", link: "/health-beauty" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${searchTerm.trim()}`);
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
        <Row>
          {/* 왼쪽 카테고리 메뉴 */}
          <Col md={3} lg={2} className="sidebar">
            <h3>Categories</h3>
            <ul className="category-menu">
              {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={category.link}>{category.name}</Link>
                  </li>
              ))}
            </ul>
          </Col>

          {/* 메인 컨텐츠 */}
          <Col md={9} lg={10}>
            {/* 검색바 */}
            <div className="mb-4">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch /> Search
                  </Button>
                </InputGroup>
              </Form>
            </div>

            {/* 광고 배너 */}
            <div className="advertisement-banner mb-4">
              <img src={advertisementBanner} alt="iPhone 14 Series" />
              <div className="banner-overlay">
                <div className="apple-logo">
                  <img src="/apple-logo.png" alt="Apple" width="40" />
                  <span>iPhone 14 Series</span>
                </div>
                <h2>Up to 10% off Voucher</h2>
                <Button variant="outline-light">Shop Now →</Button>
              </div>
            </div>

            {/* Today's 섹션 */}
            <div className="section-header d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <div className="red-marker"></div>
                <h4 className="mb-0">Today's</h4>
              </div>
              <div className="navigation-arrows">
                <Button variant="light" className="me-2"><FaArrowLeft /></Button>
                <Button variant="light"><FaArrowRight /></Button>
              </div>
            </div>

            {/* 추천 상품 그리드 */}
            <div className="product-grid mb-4">
              {homeData.recentItems.map((item) => (
                  <div key={item.itemId} className="product-grid-item">
                    <div className="product-poster">
                      <span className="discount-badge">-{item.discount}%</span>
                      <button className="wishlist-icon"><FaHeart /></button>
                      <button className="quick-view"><FaEye /></button>
                      <img src={item.posterUrl} alt={item.title} />
                    </div>
                    <div className="product-info">
                      <h6>{item.title}</h6>
                      <div className="price-info">
                        <span className="current-price">${item.currentPrice}</span>
                        <span className="original-price">${item.originalPrice}</span>
                      </div>
                      <div className="rating">
                        {"★".repeat(5)} ({item.rating})
                      </div>
                      <Button variant="dark" className="add-to-cart-btn">Add to Cart</Button>
                    </div>
                  </div>
              ))}
            </div>

            {/* Browse By Category */}
            <div className="section-header mb-3">
              <div className="d-flex align-items-center">
                <div className="red-marker"></div>
                <h4 className="mb-0">Browse By Category</h4>
              </div>
            </div>
            <div className="category-grid">
              <div className="category-item">
                <i className="category-icon">📱</i>
                <span>Phones</span>
              </div>
              <div className="category-item">
                <i className="category-icon">💻</i>
                <span>Computers</span>
              </div>
              <div className="category-item">
                <i className="category-icon">⌚</i>
                <span>SmartWatch</span>
              </div>
              <div className="category-item">
                <i className="category-icon">📸</i>
                <span>Camera</span>
              </div>
              <div className="category-item">
                <i className="category-icon">🎧</i>
                <span>HeadPhones</span>
              </div>
              <div className="category-item">
                <i className="category-icon">🎮</i>
                <span>Gaming</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}

export default Home;
