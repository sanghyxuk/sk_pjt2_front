// src/pages/WishListPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlistItems } from '../api/wishlistApi';
import Pagination from '../components/Pagination';
import '../styles/WishlistPage.css';

function WishListPage() {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useAuth();

    // 1-based
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const size = 3; // 예시

    useEffect(() => {
        if (user && user.email && user.accessToken) {
            fetchWishlist(1);
        }
    }, [user]);

    useEffect(() => {
        if (currentPage > 1 && user && user.email && user.accessToken) {
            fetchWishlist(currentPage);
        }
    }, [currentPage]);

    const fetchWishlist = async (frontPage) => {
        try {
            const realPage = frontPage - 1;
            const data = await getWishlistItems(realPage, size, {
                email: user.email,
                accessToken: user.accessToken
            });
            setWishlist(data.wishlist || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('찜 목록 불러오기 오류:', error);
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
                                <li className="menu-item">
                                    <Link to="/mypurchase" className="sidebar-link">My purchase</Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My WishList</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item active">
                                    <Link to="/wishlist" className="sidebar-link">
                                        My WishList
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My WishList (0-based)</h1>
                            {wishlist.length > 0 ? (
                                <>
                                    <div className="item-grid">
                                        {wishlist.map((item) => (
                                            <div className="item-card" key={item.pdtId}>
                                                <img
                                                    src={item.imageUrl?.[0] || ''}
                                                    alt={item.pdtName}
                                                />
                                                <h3>{item.pdtName}</h3>
                                                <p className="price">${item.price}</p>
                                                <button className="add-to-cart-btn">Add To Cart</button>
                                            </div>
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage} // 1-based
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            ) : (
                                <p className="empty-message">찜한 상품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishListPage;
