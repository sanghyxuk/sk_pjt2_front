// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import HeartIcon from '../assets/free-icon-heart-1077035.png';
import CartIcon from '../assets/free-icon-shopping-cart-icon-15328226.png';
import ProfileIcon from '../assets/free-icon-person-2815428.png';
import '../styles/Header.css';

function Header() {
    return (
        <>
            <div className="top-black-bar"></div>
            <div className="header-container">
                <div className="header-inner">
                    <div className="logo">Re:Use</div>
                    <nav className="nav-menu">
                        <a className="nav-item" href="/">Home</a>
                        <a className="nav-item" href="/contact">Contact</a>
                        <a className="nav-item" href="/chat">Chat</a>
                        <a className="nav-item" href="/register">Sign Up</a>
                    </nav>
                    <div className="header-right">
                        <div className="search-box">
                            <input className="search-input" placeholder="What are you looking for?" />
                            <button className="search-button"></button>
                        </div>
                        <div className="icon-container">
                            <a className="icon-link" href="/wishlist">
                                <img className="icon-image" src={HeartIcon} alt="Wishlist" />
                            </a>
                            <a className="icon-link" href="/cart">
                                <img className="icon-image" src={CartIcon} alt="Cart" />
                            </a>
                            <a className="icon-link" href="/profile/edit">
                                <img className="icon-image" src={ProfileIcon} alt="Profile" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divider" />
        </>
    );
}

export default Header;
