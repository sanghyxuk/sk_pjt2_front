// src/pages/RegisterPage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KakaoIcon from '../assets/free-icon-black-oval-speech-bubble-54466.png';
import GoogleIcon from '../assets/free-icon-google-300221.png';
import '../styles/RegisterPage.css';

function RegisterPage() {
    const [userInput, setUserInput] = useState({
        name: '',
        phoneOrEmail: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('회원가입 요청:', userInput);
        alert('회원가입 완료(예시)');
        setUserInput({ name: '', phoneOrEmail: '', password: '' });
    };

    return (
        <div className="outer-container">
            <Header />
            <div className="main-content">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h1 className="title">회원가입</h1>
                    <p className="sub-title">Enter your details below</p>

                    <label className="label">Name</label>
                    <input
                        className="input"
                        name="name"
                        value={userInput.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="label">Email or Phone Number</label>
                    <input
                        className="input"
                        name="phoneOrEmail"
                        value={userInput.phoneOrEmail}
                        onChange={handleChange}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        value={userInput.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="create-button" type="submit">
                        Create Account
                    </button>

                    <button className="kakao-button" type="button">
                        <img className="kakao-img" src={KakaoIcon} alt="Kakao Icon" />
                        카카오로 시작
                    </button>

                    <button className="google-button" type="button">
                        <img className="google-img" src={GoogleIcon} alt="Google Icon" />
                        Sign up with Google
                    </button>

                    <div className="login-link">
                        Already have an account? <a href="/login">Log in</a>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default RegisterPage;
