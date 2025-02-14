// src/components/Header.js
import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeartIcon from '../assets/free-icon-heart-1077035.png';
import ProfileIcon from '../assets/free-icon-person-2815428.png';
import '../styles/Header.css';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current user:', user);
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };



    return (
        <Navbar bg="light" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fs-4">Re:Use</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* 좌측: 네비게이션 링크 */}
                    <Nav className="navigation-links">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/items">Product</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        {user?.role === 'ROLE_ADMIN' && (
                            <Nav.Link as={Link} to="/admin/users">관리자 페이지</Nav.Link>
                        )}
                    </Nav>
                    {/* 우측: 검색바와 인증 버튼 */}
                    <div className="right-section ms-auto">
                        <div className="search-box">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="What are you looking for?"
                            />
                            <button className="search-button" />
                        </div>
                        <Nav className="auth-links">
                            {user ? (
                                <div className="auth-buttons">
                                    <button onClick={handleLogout} className="logout-button">로그아웃</button>
                                    <Nav.Link as={Link} to="/wishlist">
                                        <img className="icon-image" src={HeartIcon} alt="Wishlist" />
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/profile/edit">
                                        <img className="icon-image" src={ProfileIcon} alt="My Profile" />
                                    </Nav.Link>
                                </div>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                                    <Nav.Link as={Link} to="/register">회원가입</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
