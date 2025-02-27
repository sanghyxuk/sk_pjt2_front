import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useHomeData } from '../hooks/useHome';
import { getMySaleItems } from '../api/mysaleApi';
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';
import { postsAPI } from '../api/posts';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemLists.css';
import { hasDeletePermission } from '../utils/authUtils';

function ItemLists() {
    const { homeData, handleSearch, loading, totalPages, fetchCategoryData } = useHomeData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get('category') || 'ALL';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);

    // 내 판매 및 위시리스트 목록
    const [mySaleIds, setMySaleIds] = useState([]);
    const [wishlistItems, setWishlistItems] = useState(new Set());

    // 내 판매 목록 불러오기
    useEffect(() => {
        if (user && user.email && user.accessToken) {
            getMySaleItems(0, 999, {
                email: user.email,
                accessToken: user.accessToken,
            })
                .then((data) => {
                    const saleIds = data.sales?.map((item) => item.pdtId) || [];
                    setMySaleIds(saleIds);
                })
                .catch((err) => console.error('내 판매목록 로딩 오류:', err));
        }
    }, [user]);

    // 위시리스트 불러오기
    useEffect(() => {
        if (user && user.email && user.accessToken) {
            getWishlistItems(0, 999, {
                email: user.email,
                accessToken: user.accessToken,
            })
                .then((res) => {
                    const pdtIds = res.wishlist?.map((w) => w.pdtId) || [];
                    setWishlistItems(new Set(pdtIds));
                })
                .catch((err) => console.error('위시리스트 로딩 오류:', err));
        }
    }, [user]);

    // 쿼리 변경 시 상품 목록 조회
    useEffect(() => {
        const category = searchParams.get('category');
        if (category && category !== 'ALL') {
            fetchCategoryData(category, currentPage);
        } else {
            handleSearch(searchTerm, currentPage);
        }
    }, [location.search, user]);

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

    const handlePageChange = (pageNumber) => {
        const newPageIndex = pageNumber - 1;
        const params = new URLSearchParams(location.search);
        params.set('page', newPageIndex);
        navigate(`${location.pathname}?${params.toString()}`);
        setCurrentPage(newPageIndex);
    };

    const handleShowAllProducts = () => {
        const params = new URLSearchParams();
        params.set('page', '0');
        navigate(`/items?${params.toString()}`);
        handleSearch('', 0);
    };

    const handleCategoryClick = async (category) => {
        const params = new URLSearchParams();
        if (category !== 'ALL') {
            params.set('category', category);
        }
        params.set('page', '0');
        navigate(`/items?${params.toString()}`);
        if (category === 'ALL') {
            handleSearch('', 0);
        } else {
            await fetchCategoryData(category, 0);
        }
    };

    // 찜하기/찜취소 처리 (상품의 pdtId를 기준으로)
    const handleToggleWishlist = async (item) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        try {
            const email = user.email;
            // 주의: homeData의 상품은 item.itemId에 pdtId 값이 저장되어 있음
            const inWishlist = wishlistItems.has(item.itemId);
            if (inWishlist) {
                await toggleWishdel(email, item.itemId, user.accessToken);
                setWishlistItems((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(item.itemId);
                    return newSet;
                });
                alert('위시리스트에서 제거되었습니다!');
            } else {
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
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="mb-4">
                {selectedCategory !== 'ALL' ? `${selectedCategory} 카테고리` : '모든 상품'}
            </h2>

            {/* 카테고리 버튼 */}
            <div className="mb-4 category-buttons">
                <Button
                    variant={selectedCategory === 'ALL' ? 'primary' : 'secondary'}
                    onClick={handleShowAllProducts}
                >
                    ALL
                </Button>
                {['디지털기기', '가구/인테리어', '의류', '생활가전', '뷰티/미용', '기타'].map((cat) => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'primary' : 'secondary'}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat}
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

            {/* 상품 등록하기 버튼 */}
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
                    homeData.searchResults.map((item) => {
                        const isMine = mySaleIds.includes(item.itemId);
                        const isWished = wishlistItems.has(item.itemId);
                        return (
                            <div className="product-card" key={item.itemId}>
                                <Link to={`/items/${item.itemId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <img src={item.image || 'default-image-url.jpg'} alt={item.title} />
                                    <h5 className="product-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {item.title}
                                    </h5>
                                    <div className="price">₩{Number(item.itemprice).toLocaleString()}</div>
                                </Link>
                                {user && !isMine && (
                                    <Button className="btn-add-to-cart" onClick={() => handleToggleWishlist(item)}>
                                        {isWished ? '찜취소' : '찜해두기'}
                                    </Button>
                                )}
                                {/* 상품 등록자이면 판매완료 버튼 표시 */}
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
                                        판매완료
                                    </Button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4">검색된 상품이 없습니다.</div>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 0 && (
                <Pagination
                    currentPage={currentPage + 1} // UI는 1-based
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </Container>
    );
}

export default ItemLists;
