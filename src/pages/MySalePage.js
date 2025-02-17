// src/pages/MySalePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 인증 정보
import { getMySaleItems } from '../api/mysaleApi';
import '../styles/MySalePage.css';

function MySalePage() {
    const [mySales, setMySales] = useState([]);
    const { user } = useAuth();  // 로그인 시 저장된 user 객체

    const page = 1;
    const size = 3;

    useEffect(() => {
        if (user && user.email && user.accessToken) {
            fetchMySales()
                .then(() => {
                })
                .catch((err) => console.error('fetchMySales error:', err));
        }
    }, [user]);


    const fetchMySales = async () => {
        try {
            const data = await getMySaleItems(page, size, {
                email: user.email,
                accessToken: user.accessToken,
            }); // get 요청
            setMySales(data);
        } catch (error) {
            console.error('판매 목록 불러오기 오류:', error);
        }
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
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

                    {/* 오른쪽 메인 영역 */}
                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">My sale</h1>
                            {mySales.length > 0 ? (
                                <div className="item-grid">
                                    {mySales.map((item) => (
                                        <div className="item-card" key={item.pdtId}>
                                            {/* imageUrl는 배열이므로 첫 이미지를 우선 표시 */}
                                            <img src={item.imageUrl[0]} alt={item.pdtName} />
                                            {/* 상품명 */}
                                            <h3>{item.pdtName}</h3>
                                            {/* 가격 */}
                                            <p className="price">${item.price}</p>
                                            {/* 임시 버튼 */}
                                            <button className="add-to-cart-btn">Add To Cart</button>
                                        </div>
                                    ))}
                                </div>
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
