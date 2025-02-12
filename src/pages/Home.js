import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaEye } from 'react-icons/fa';
import { useHomeData } from '../hooks/useHome';
import '../styles/Home.css';
import advertisementBanner from '../assets/advertisement_banner.jpg';

function Home() {
  const { homeData, loading, error } = useHomeData();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: "Phones", icon: "📱" },
    { name: "Computers", icon: "💻" },
    { name: "SmartWatch", icon: "⌚" },
    { name: "Camera", icon: "📷" },
    { name: "HeadPhones", icon: "🎧" },
    { name: "Gaming", icon: "🎮" }
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
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
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

            <div className="banner mb-4">
              <img src={advertisementBanner} alt="iPhone 14 Series" />
              <div className="banner-overlay">
                <div className="apple-logo">
                  <img src="/apple-logo.png" alt="Apple" width="40" />
                  <span>iPhone 14 Series</span>
                </div>
                <h2>(광고)Up to 10% off Voucher</h2>
                <Button variant="outline-light">Shop Now →</Button>
              </div>
            </div>

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
                      <span className="discount-badge">-{item.discount}%</span>
                      <button className="wishlist-icon"><FaHeart /></button>
                      <button className="quick-view"><FaEye /></button>
                      <img src={item.posterUrl} alt={item.title} />
                    </div>
                    <div className="product-info">
                      <h6>
                        <Link to={`/items/${item.itemId}`} className="product-title-link">{item.title}</Link>
                      </h6>
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

            <Button className="more-button" onClick={() => navigate('/items')}>더보기</Button>

            <div className="divider"></div>

            <section className="categories">
              <h3 className="text-start">Browse By Category</h3>
              <div className="category-grid">
                {categories.map((category, index) => (
                    <div key={index} className="category-item">
                      <span>{category.icon}</span>
                      <Link to={category.link}>{category.name}</Link>
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
