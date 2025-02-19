import React, { useState } from 'react';
import KakaoIcon from '../assets/free-icon-black-oval-speech-bubble-54466.png';
import GoogleIcon from '../assets/free-icon-google-300221.png';
import '../styles/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { authAPI } from '../api/auth';

function RegisterPage() {
    // 회원가입에 필요한 필드를 JSON 스펙에 맞게 email, userName, password로 수정
    const [userInput, setUserInput] = useState({
        email: '',
        userName: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // authAPI.signup을 통해 JSON 형식의 데이터 전송
            const response = await authAPI.signup(userInput);
            console.log('회원가입 응답:', response.data);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
            setUserInput({ email: '', userName: '', password: '' });
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h1 className="title">회원가입</h1>
                    <p className="sub-title">Enter your details below</p>

                    <label className="label">Email</label>
                    <input
                        className="input"
                        name="email"
                        type="email"
                        value={userInput.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="label">Username</label>
                    <input
                        className="input"
                        name="userName"
                        value={userInput.userName}
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
        </div>
    );
}

export default RegisterPage;