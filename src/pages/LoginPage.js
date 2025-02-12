// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KakaoIcon from '../assets/free-icon-black-oval-speech-bubble-54466.png';
import GoogleIcon from '../assets/free-icon-google-300221.png';
import '../styles/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        alert(`로그인 시도: ${email}, ${password}`);
    };

    return (
        <div className="outer-container">
            <Header />
            <div className="main-content">
                <form className="login-form" onSubmit={handleLogin}>
                    <h1 className="title">로그인</h1>
                    <p className="sub-title">Enter your details below</p>

                    <label className="label">Email or Phone Number</label>
                    <input
                        className="input"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="row">
                        <button className="login-button" type="submit">
                            Log In
                        </button>
                        <a className="forgot-link" href="#!">
                            Forget Password?
                        </a>
                    </div>

                    <button className="kakao-button" type="button">
                        <img className="kakao-img" src={KakaoIcon} alt="Kakao Icon" />
                        카카오로 시작
                    </button>

                    <button className="google-button" type="button">
                        <img className="google-img" src={GoogleIcon} alt="Google Icon" />
                        Sign up with Google
                    </button>

                    <div className="sign-up-link">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default LoginPage;
