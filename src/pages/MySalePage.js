// src/pages/MySalePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMySaleItems } from '../api/mysaleApi';
import Pagination from '../components/Pagination';
import '../styles/MySalePage.css';

function MySalePage() {
    const { user } = useAuth();

    // 판매 목록
    const [mySales, setMySales] = useState([]);

    // 프론트는 1-based로 currentPage를 표시
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    // 한 페이지당 개수
    const size = 3; // (예시)

    useEffect(() => {
        if (user && user.email && user.accessToken) {
            fetchMySales(1);
        }
    }, [user]);

    useEffect(() => {
        if (currentPage >= 1 && user && user.email && user.accessToken) {
            fetchMySales(currentPage);
        }
    }, [currentPage]);


    const fetchMySales = async (frontPage) => {
        try {
            // 0-based page
            const realPage = frontPage - 1;

            // API 호출: realPage
            const data = await getMySaleItems(realPage, size, {
                email: user.email,
                accessToken: user.accessToken
            });

            setMySales(data.sales || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('판매 목록 불러오기 오류:', error);
        }
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const navigate = useNavigate();  // useNavigate 훅을 사용하여 navigate 함수 생성

    const handleViewDetails = (pdtId) => {
        // 클릭 시 해당 상품의 상세 페이지로 이동
        navigate(`/items/${pdtId}`);
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
                    <div className="sidebar-container">
                        <div className="sidebar">
                            <h3 className="sidebar-title">Manage My Account</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/profile/edit" className="sidebar-link">
                                        Edit My Profile
                                    </Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My Items</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item active">
                                    <Link to="/mysale" className="sidebar-link">
                                        My sale
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/mypurchase" className="sidebar-link">
                                        My purchase
                                    </Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My WishList</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/wishlist" className="sidebar-link">
                                        My WishList
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My sale</h1>

                            {mySales.length > 0 ? (
                                <>
                                    <div className="item-grid">
                                        {mySales.map((item) => (
                                            <div className="item-card" key={item.pdtId}>
                                                <img
                                                    src={item.imageUrl?.[0] || ''}
                                                    alt={item.pdtName}
                                                />
                                                <h3>{item.pdtName}</h3>
                                                <p className="price">${item.price}</p>
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleViewDetails(item.pdtId)}  // 버튼 클릭 시 해당 함수 실행
                                                    style={{ fontSize: '15px' }}
                                                >
                                                    상품 상세보기
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 프론트는 1-based currentPage, 백엔드에 보낼 땐 -1 */}
                                    <Pagination
                                        currentPage={currentPage}       // 1-based
                                        totalPages={totalPages}          // 백엔드가 준 3 => UI도 "1..3"
                                        onPageChange={handlePageChange}  // 페이지 번호 바꾸면 setCurrentPage
                                    />
                                </>
                            ) : (
                                <p className="empty-message">판매한 상품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MySalePage;
