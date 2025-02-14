// src/pages/MyPurchasePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPurchaseItems } from '../api/mypurchaseApi';
import '../styles/MyPurchasePage.css';

function MyPurchasePage() {
    const [myPurchases, setMyPurchases] = useState([]);
    const email = 1; // 임시 유저 ID

    useEffect(() => {
        fetchMyPurchases();
    }, []);

    const fetchMyPurchases = async () => {
        const data = await getMyPurchaseItems(email);
        setMyPurchases(data);
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
                    {/* 사이드바 영역 (EditProfilePage와 동일한 구조) */}
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

                    {/* 오른쪽 메인 영역 */}
                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My purchase</h1>
                            {myPurchases.length > 0 ? (
                                <div className="item-grid">
                                    {myPurchases.map((item) => (
                                        <div className="item-card" key={item.id}>
                                            {/* 할인 태그 */}
                                            {item.discount && (
                                                <div className="discount">-{item.discount}%</div>
                                            )}
                                            {/* 상품 이미지 */}
                                            <img src={item.imageUrl} alt={item.title} />
                                            {/* 상품명 */}
                                            <h3>{item.title}</h3>
                                            {/* 가격 */}
                                            <p className="price">${item.price}</p>
                                            {/* 예시: 장바구니 버튼(디자인만 예시) */}
                                            <button className="add-to-cart-btn">Add To Cart</button>
                                        </div>
                                    ))}
                                </div>
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
