// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KakaoIcon from '../assets/free-icon-black-oval-speech-bubble-54466.png';
import GoogleIcon from '../assets/free-icon-google-300221.png';
import '../styles/LoginPage.css';
import {authAPI} from "../api/auth";
import { useAuth } from '../context/AuthContext';

function LoginPage() {

    const [userInput, setUserInput] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate(); // 추가: 네비게이트 훅 초기화

    const { login } = useAuth();

    const handleLogin = (e) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // authAPI.signup을 통해 JSON 형식의 데이터 전송
            const response = await login(userInput);
            console.log('로그인 응답:', response.data);
            alert('로그인이 완료되었습니다.');
            const XAuthUser = response.headers['x-auth-user'];
            const AccessToken = response.headers['accesstoken'];
            console.log('로그인 응답:', XAuthUser);
            console.log('로그인 응답:', AccessToken);
            setUserInput({ email: '', password: '' });
            navigate('/'); // 추가: 로그인 성공 후 홈 화면으로 이동
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인에 실패했습니다.');
        }
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="title">로그인</h1>
                    <p className="sub-title">Enter your details below</p>

                    <label className="label">Email or Phone Number</label>
                    <input
                        className="input"
                        name="email"
                        type="text"
                        value={userInput.email}
                        onChange={handleLogin}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        value={userInput.password}
                        onChange={handleLogin}
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
        </div>
    );
}

export default LoginPage;
