import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
// import logoLight from '../assets/logo-light.png';
// import logoDark from '../assets/logo-dark.png';

function Navigation() {
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
      <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme} expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="fs-4">Re:Use</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/Items">Product</Nav.Link>
              <Nav.Link as={Link} to="/Contact">Contact</Nav.Link>
              <Nav.Link as={Link} to="/Signup">Sign Up</Nav.Link>
              {user && (
                  user.role === 'ROLE_ADMIN' ? (
                      <Nav.Link as={Link} to="/admin/users">관리자 페이지</Nav.Link>
                  ) : (
                      <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
                  )
              )}
            </Nav>
            <div className="d-flex align-items-center gap-3">
              <Button
                  variant={theme === 'dark' ? 'light' : 'dark'}
                  size="sm"
                  onClick={toggleTheme}
                  className="d-flex align-items-center"
              >
                {theme === 'dark' ? <FaSun className="me-1" /> : <FaMoon className="me-1" />}
                {theme === 'dark' ? '라이트 모드' : '다크 모드'}
              </Button>
              <Nav>
                {user ? (
                    <Dropdown align="end" onToggle={(isOpen) => setShowDropdown(isOpen)}>
                      <Dropdown.Toggle variant="link" id="dropdown-basic" className="d-flex align-items-center">
                        <FaUser className="fs-4" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu show={showDropdown}>
                        <Dropdown.Item as={Link} to="/mypage">마이페이지</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <>
                      <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                      <Nav.Link as={Link} to="/signup">회원가입</Nav.Link>
                    </>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default Navigation;
