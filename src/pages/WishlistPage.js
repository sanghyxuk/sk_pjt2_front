import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const size = 3;
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email && user.accessToken && currentPage >= 1) {
            fetchWishlist(currentPage);
        }
    }, [user, currentPage]);

    const fetchWishlist = async (frontPage) => {
        try {
            const realPage = frontPage - 1;
            const data = await getWishlistItems(realPage, size, {
                email: user.email,
                accessToken: user.accessToken,
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
                    {/* Sidebar */}
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
                                <li className="menu-item active">
                                    <Link to="/wishlist" className="sidebar-link">
                                        My WishList
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Area */}
                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My WishList</h1>
                            {wishlist.length > 0 ? (
                                <>
                                    <div className="item-grid">
                                        {wishlist.map((item) => (
                                            <div className="item-card" key={item.pdtId}>
                                                {/* 상품 이미지와 제목을 클릭하면 상세 페이지로 이동 */}
                                                <Link to={`/items/${item.pdtId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <img src={item.imageUrl?.[0] || 'default-image-url.jpg'} alt={item.pdtName} />
                                                    <h3>{item.pdtName}</h3>
                                                </Link>
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
