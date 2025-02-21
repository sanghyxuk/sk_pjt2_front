// src/pages/ItemLists.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import { getWishlistItems, toggleWish, toggleWishdel } from '../api/wishlistApi';
import { getMySaleItems } from '../api/mysaleApi';
import { useHomeData } from '../hooks/useHome'; // (상품 검색, 카테고리 조회, etc)
import Pagination from '../components/Pagination';

import '../styles/common.css';
import '../styles/ItemLists.css';

function ItemLists() {
    // 홈데이터 훅에서, 검색결과 / handleSearch / totalPages 등을 가져옵니다.
    const { homeData, handleSearch, loading, totalPages, fetchCategoryData } = useHomeData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 쿼리 파라미터
    const searchParams = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);

    // 카테고리: 'ALL'이 기본
    const selectedCategory = searchParams.get('category') || 'ALL';
    const categories = ['ALL', '디지털기기', '가구/인테리어', '의류', '생활가전', '뷰티/미용', '기타'];

    // 위시리스트, 내 판매 목록
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const [mySaleIds, setMySaleIds] = useState([]);

    // 1) 마운트/유저 변경 시: 위시리스트 목록 가져오기
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
            .catch((err) => {
                console.error('위시리스트 로딩 오류:', err);
            });
    }, [user]);

    // 2) 내 판매 상품 목록 불러오기
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

    // 3) 페이지 진입 or 검색/카테고리 변경 시: 상품 목록 조회
    useEffect(() => {
        const category = searchParams.get('category');
        if (category && category !== 'ALL') {
            fetchCategoryData(category, currentPage);
        } else {
            handleSearch(searchTerm, currentPage);
        }
    }, [location.search, user]);

    // 검색 폼 제출
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm.trim()) {
            params.set('search', searchTerm.trim());
            params.set('page', '0');
            navigate(`/items?${params.toString()}`);
        } else {
            // 검색어가 비었으면 그냥 /items
            navigate('/items');
        }
    };

    // 페이지네이션 변경
    const handlePageChange = (pageNumber) => {
        const newPageIndex = pageNumber - 1; // 0-based
        const params = new URLSearchParams(location.search);
        params.set('page', newPageIndex);
        navigate(`${location.pathname}?${params.toString()}`);
        setCurrentPage(newPageIndex);
    };

    // "All" 버튼 클릭 시
    const handleShowAllProducts = () => {
        const params = new URLSearchParams();
        params.set('page', '0');
        // category 삭제
        navigate(`/items?${params.toString()}`);
        handleSearch('', 0);
    };

    // 개별 카테고리 버튼 클릭 시
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

    // 찜하기/찜취소
    const handleToggleWishlist = async (item) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        try {
            const email = user.email;
            const inWishlist = wishlistItems.has(item.itemId);
            if (inWishlist) {
                // 찜취소
                await toggleWishdel(email, item.itemId, user.accessToken);
                setWishlistItems((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(item.itemId);
                    return newSet;
                });
                alert('위시리스트에서 제거되었습니다!');
            } else {
                // 찜하기
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
                {selectedCategory !== 'ALL'
                    ? `${selectedCategory} 카테고리`
                    : '모든 상품'}
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
                    homeData.searchResults.map((item) => {
                        const isMine = mySaleIds.includes(item.itemId);
                        const isWished = wishlistItems.has(item.itemId);
                        return (
                            <div className="product-card" key={item.itemId}>
                                <Link to={`/items/${item.itemId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <img src={item.image || 'default-image-url.jpg'} alt={item.title} />
                                    <h5>{item.title}</h5>
                                    <div className="price">₩{Number(item.itemprice).toLocaleString()}</div>
                                </Link>
                                {user && isMine ? (
                                    // 내 판매 상품이면 찜 버튼 대신 "상품 상세보기" 혹은 아무것도 안 보여줄 수도 있음
                                    <></>
                                ) : (
                                    // 내 상품이 아니면 찜 버튼
                                    <Button
                                        className="btn-add-to-cart"
                                        onClick={() => handleToggleWishlist(item)}
                                    >
                                        {isWished ? '찜취소' : '찜해두기'}
                                    </Button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    searchTerm.trim() !== '' && (
                        <div className="text-center py-4">검색된 상품이 없습니다.</div>
                    )
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
