// src/pages/MySalePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMySaleItems } from '../api/mysaleApi';
import Pagination from '../components/Pagination';
import '../styles/MySalePage.css';

function MySalePage() {
    const { user } = useAuth();
    const [mySales, setMySales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const size = 3;
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email && user.accessToken) {
            fetchMySales(currentPage);
        }
    }, [user, currentPage]);

    const fetchMySales = async (frontPage) => {
        try {
            const realPage = frontPage - 1;
            const data = await getMySaleItems(realPage, size, {
                email: user.email,
                accessToken: user.accessToken,
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

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
                    <div className="sidebar-container">
                        <div className="sidebar">
                            <h3 className="sidebar-title">Manage My Account</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/profile/edit" className="sidebar-link">Edit My Profile</Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My Items</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item active">
                                    <Link to="/mysale" className="sidebar-link">My sale</Link>
                                </li>
                                <li className="menu-item">
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
                            <h1 className="page-title">My sale</h1>
                            {mySales.length > 0 ? (
                                <>
                                    <div className="item-grid">
                                        {mySales.map((item) => (
                                            <div className="item-card" key={item.pdtId}>
                                                <Link to={`/items/${item.pdtId}`}>
                                                    <img src={item.imageUrl?.[0] || ''} alt={item.pdtName} />
                                                </Link>
                                                <h3>
                                                    <Link to={`/items/${item.pdtId}`} className="product-title-link">
                                                        {item.pdtName}
                                                    </Link>
                                                </h3>
                                                <p className="price">₩{Number(item.price).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
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