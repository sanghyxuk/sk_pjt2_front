import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // CSS 적용

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="logo">Re:Use</h1>
            <ul className="nav-links">
                <li><Link to="/mysale">내가 판매한 물품</Link></li>
                <li><Link to="/wishlist">찜 목록</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
