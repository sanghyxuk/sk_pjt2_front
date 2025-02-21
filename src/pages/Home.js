import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';
import { useHomeData } from '../hooks/useHome';
import { getMySaleItems } from '../api/mysaleApi';
import '../styles/Home.css';
import advertisementBanner from '../assets/advertisement_banner.jpg';

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { homeData, loading, error } = useHomeData();

    // 찜 목록 state (wishlistItems는 Set형태로 pdtId들을 저장)
    const [wishlistItems, setWishlistItems] = useState(new Set());
    // 내 판매 목록의 상품 ID 목록 (실제 pdtId가 저장됨)
    const [mySaleIds, setMySaleIds] = useState([]);

    const categories = [
        { name: "디지털기기", icon: "📱" },
        { name: "가구/인테리어", icon: "🛋️" },
        { name: "의류", icon: "👕" },
        { name: "생활가전", icon: "🔌" },
        { name: "뷰티/미용", icon: "💄" },
        { name: "기타", icon: "📦" }
    ];

    // 위시리스트 불러오기 – 페이지 진입 시 최신 위시리스트 상태 반영
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

    // 내 판매 상품 목록 불러오기
    useEffect(() => {
        if (!user || !user.email || !user.accessToken) return;
        getMySaleItems(0, 999, {
            email: user.email,
            accessToken: user.accessToken,
        })
            .then((data) => {
                const saleIds = data.sales?.map((item) => item.pdtId) || [];
                setMySaleIds(saleIds);
            })
            .catch((err) => console.error('내 판매목록 로딩 오류:', err));
    }, [user]);

    // 찜하기/찜취소 버튼 로직 – 다른 사용자가 등록한 상품에 대해서만 표시
    const handleToggleWishlist = async (item) => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        const email = user.email;
        try {
            // homeData의 상품은 item.itemId가 실제로 pdtId값을 담고 있음
            if (wishlistItems.has(item.itemId)) {
                // 찜 취소 (accessToken 전달)
                await toggleWishdel(email, item.itemId, user.accessToken);
                setWishlistItems((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(item.itemId);
                    return newSet;
                });
                alert('위시리스트에서 제거되었습니다!');
            } else {
                // 찜 등록 (accessToken 전달)
                await toggleWish(email, item.itemId, item.title, item.itemprice, user.accessToken);
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
                    {/* 배너 영역 */}
                    <div className="banner mb-4">
                        <img src={advertisementBanner} alt="iPhone 14 Series" />
                        <div className="banner-overlay">
                            <div className="apple-logo">
                                <span>iPhone 14 Series</span>
                            </div>
                            <h2>Up to 10% off Voucher</h2>
                            <Button variant="outline-light">Shop Now →</Button>
                        </div>
                    </div>

                    {/* 추천상품 영역 */}
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
                                    <Link to={`/items/${item.itemId}`}>
                                        <img src={item.image} alt={item.title} />
                                    </Link>
                                </div>
                                <div className="product-info">
                                    <h6>
                                        <Link to={`/items/${item.itemId}`} className="product-title-link">
                                            {item.title}
                                        </Link>
                                    </h6>
                                    <div className="price-info">
                    <span className="current-price">
                      가격: ₩{Number(item.itemprice).toLocaleString()} 원
                    </span>
                                    </div>
                                    {/* 다른 사용자가 등록한 상품일 경우에만 찜하기 버튼 표시 */}
                                    {user && !mySaleIds.includes(item.itemId) && (
                                        <Button className="btn-add-to-cart" onClick={() => handleToggleWishlist(item)}>
                                            {wishlistItems.has(item.itemId) ? '찜취소' : '찜해두기'}
                                        </Button>
                                    )}
                                    {/* 내 판매 상품인 경우 버튼은 제거 – 이미지/이름 클릭 시 상세 페이지로 이동 */}
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
                            <div
                                className="category-item"
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    textAlign: 'center'
                                }}
                            >
                                <span>📦</span>
                                <Link to="/items" className="category-link" style={{ color: 'white' }}>
                                    모두 보기
                                </Link>
                            </div>
                            {categories.map((category, index) => (
                                <div key={index} className="category-item">
                                    <span>{category.icon}</span>
                                    <Link to={`/items?category=${category.name}`} className="category-link">
                                        {category.name}
                                    </Link>
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
