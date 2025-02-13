// src/components/Header.js
import React, {useEffect, useState} from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import HeartIcon from '../assets/free-icon-heart-1077035.png';
import CartIcon from '../assets/free-icon-shopping-cart-icon-15328226.png';
import ProfileIcon from '../assets/free-icon-person-2815428.png';
import '../styles/Header.css';


function Header() {

    const { theme, toggleTheme } = useTheme();
    const { user, logout, login } = useAuth(); // login 함수 추가
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태 관리

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

    const handleLogin = async () => {
        const credentials = { id: 'testUser', password: 'password' }; // 하드코딩된 사용자 정보
        try {
            await login(credentials);
            // navigate('/'); // 로그인 후 이동할 페이지 (원래 동작을 원할 경우 주석 해제)
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-3">
                <Container>
                    {/* 로고 */}
                    <Navbar.Brand as={Link} to="/" className="fs-4">Re:Use</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* 메뉴 */}
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/items">Product</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                            {user?.role === 'ROLE_ADMIN' && (
                                <Nav.Link as={Link} to="/admin/users">관리자 페이지</Nav.Link>
                            )}
                        </Nav>
                        {/* 우측 영역*/}
                        <div className="d-flex align-items-center gap-3">
                            {/* 검색창 */}
                            <div className="search-box d-flex align-items-center">
                                <input className="search-input" placeholder="What are you looking for?"/>
                                <button className="search-button"></button>
                            </div>

                            {/* 로그인 여부에 따른 UI 변경 */}
                            <Nav className="d-flex align-items-center gap-3">
                                {user ? (
                                    <>
                                        {/* 아이콘 메뉴 (로그인 시에만 표시) */}
                                        <div className="icon-container d-flex">
                                            <Link className="icon-link" to="/wishlist">
                                                <img className="icon-image" src={HeartIcon} alt="Wishlist"/>
                                            </Link>
                                            <Link className="icon-link" to="/cart">
                                                <img className="icon-image" src={CartIcon} alt="Cart"/>
                                            </Link>

                                            {/* 마이페이지 드롭다운 */}
                                            <Dropdown align="end" onToggle={(isOpen) => setShowDropdown(isOpen)}>
                                                <Dropdown.Toggle variant="link" id="dropdown-basic"
                                                                 className="d-flex align-items-center">
                                                    <img className="icon-image" src={ProfileIcon} alt="Profile"/>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu show={showDropdown}>
                                                    <Dropdown.Item as={Link} to="/mypage">마이페이지</Dropdown.Item>
                                                    <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </>
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

            <div className="top-black-bar"></div>
        </>
);
}

export default Header;
