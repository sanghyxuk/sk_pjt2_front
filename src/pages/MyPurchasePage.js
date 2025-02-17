// src/pages/MyPurchasePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyPurchaseItems } from '../api/mypurchaseApi';
import Pagination from '../components/Pagination';
import '../styles/MyPurchasePage.css';

function MyPurchasePage() {
    const [myPurchases, setMyPurchases] = useState([]);
    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const size = 3;

    useEffect(() => {
        if (user && user.email && user.accessToken) {
            fetchPurchases(1); // 1-based, 실제 백엔드는 page=0
        }
    }, [user]);

    useEffect(() => {
        if (currentPage > 1 && user && user.email && user.accessToken) {
            fetchPurchases(currentPage);
        }
    }, [currentPage]);

    const fetchPurchases = async (frontPage) => {
        try {
            const realPage = frontPage - 1;
            // GET
            const data = await getMyPurchaseItems(realPage, size, {
                email: user.email,
                accessToken: user.accessToken
            });
            setMyPurchases(data.purchases || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('구매 목록 불러오기 오류:', err);
        }
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
                    {/* 사이드바 */}
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
                                <li className="menu-item">
                                    <Link to="/mysale" className="sidebar-link">My sale</Link>
                                </li>
                                <li className="menu-item active">
                                    <Link to="/mypurchase" className="sidebar-link">My purchase</Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My WishList</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/wishlist" className="sidebar-link">My WishList</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My purchase (0-based backend)</h1>
                            {myPurchases.length > 0 ? (
                                <>
                                    <div className="item-grid">
                                        {myPurchases.map(item => (
                                            <div className="item-card" key={item.pdtId}>
                                                <img src={item.imageUrl?.[0] || ''} alt={item.pdtName} />
                                                <h3>{item.pdtName}</h3>
                                                <p className="price">${item.price}</p>
                                                <button className="add-to-cart-btn">Add To Cart</button>
                                            </div>
                                        ))}
                                    </div>

                                    <Pagination
                                        currentPage={currentPage} // 1-based
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            ) : (
                                <p className="empty-message">구매한 상품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPurchasePage;
