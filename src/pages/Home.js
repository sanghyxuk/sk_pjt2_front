import React, { useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHomeData } from '../hooks/useHome';
import { toggleWish, toggleWishdel } from '../api/wishlistApi';
import '../styles/Home.css';
import advertisementBanner from '../assets/advertisement_banner.jpg';


function Home() {
  const { homeData, loading, error } = useHomeData();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const { user } = useAuth();

  const categories = [
    { name: "Phones", icon: "\ud83d\udcf1", link: "/category/phones" },
    { name: "Computers", icon: "\ud83d\udcbb", link: "/category/computers" },
    { name: "SmartWatch", icon: "\u231a", link: "/category/smartwatch" },
    { name: "Camera", icon: "\ud83d\udcf7", link: "/category/camera" },
    { name: "HeadPhones", icon: "\ud83c\udfa7", link: "/category/headphones" },
    { name: "Gaming", icon: "\ud83c\udfae", link: "/category/gaming" }
  ];

  // 위시리스트에 아이템 추가 또는 제거하는 함수
  const handleAddToWishlist = async (item) => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const email = user?.email;
    try {
      if (wishlistItems.has(item.itemId)) {
        console.log("찜 취소 요청:", email, item.itemId); // 로그 추가
        await toggleWishdel(email, [item.itemId]); // API 호출
        setWishlistItems((prev) => {
          const newWishlist = new Set(prev);
          newWishlist.delete(item.itemId);
          return newWishlist;
        });
        alert("위시리스트에서 제거되었습니다!");
      } else {
        console.log("찜하기 요청:", email, item.itemId); // 로그 추가
        await toggleWish(email, item.itemId, item.title, item.itemprice); // API 호출
        setWishlistItems((prev) => new Set(prev).add(item.itemId));
        alert("위시리스트에 추가되었습니다!");
      }
    } catch (error) {
      console.error("위시리스트 처리 중 오류 발생:", error);
      alert("위시리스트 처리 중 오류가 발생했습니다.");
    }
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
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="product-info">
                      <h6>
                        <Link to={`/items/${item.itemId}`} className="product-title-link">{item.title}</Link>
                      </h6>
                      <div className="price-info">
                        <span className="current-price">가격: \{item.itemprice} |</span>
                        <span className="delivery-price"> 배달비: \3000</span>
                      </div>
                      <Button className="add-to-like-btn" style={{ backgroundColor: 'black', borderColor: 'black' }} onClick={() => handleAddToWishlist(item)}>
                        {wishlistItems.has(item.itemId) ? "찜취소" : "찜해두기"}
                      </Button>
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
                      <Link to={category.link} className="category-link">{category.name}</Link>
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
