// src/pages/WishListPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlistItems } from '../api/wishlistApi';
import '../styles/WishlistPage.css';

function WishListPage() {
    const [wishlist, setWishlist] = useState([]);
    const userId = 1; // 임시 유저 ID

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const data = await getWishlistItems(userId);
        setWishlist(data);
    };

    return (
        <div className="outer-container">
            <div className="wishlist-container">
                <div className="wishlist-content">
                    {/* 사이드바 영역 */}
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
                                    <Link to="/wishlist" className="sidebar-link">My WishList</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className="wishlist-main">
                        <h1 className="page-title">My WishList</h1>
                        {wishlist.length > 0 ? (
                            <div className="item-grid">
                                {wishlist.map((item) => (
                                    <div className="item-card" key={item.id}>
                                        {item.discount && (
                                            <div className="discount">-{item.discount}%</div>
                                        )}
                                        <img src={item.imageUrl} alt={item.title}/>
                                        <h3>{item.title}</h3>
                                        <p className="price">${item.price}</p>
                                        <button className="add-to-cart-btn">Add To Cart</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">찜한 상품이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishListPage;
