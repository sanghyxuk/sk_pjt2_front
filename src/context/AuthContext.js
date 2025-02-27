// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    //  초기 상태를 로컬 스토리지에서 복원
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            console.log('Starting checkAuth with current user:', user);
            const response = { data: user }; // 예시
            if (response.data) {
                setUser(prevUser => {
                    const updatedUser = {
                        ...response.data,
                        userId: prevUser?.userId || response.data.userId || response.data.user
                    };
                    console.log('Updating user state:', updatedUser);
                    return updatedUser;
                });
            } else {
                console.log('No user data in response');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials); // POST 요청
            console.log('Login response:', response.data);
            if (response) {
                const xAuthUser = response.headers['x-auth-user'];
                const accessToken = response.headers['accesstoken'];
                const userData = {
                    ...response.data,
                    userId: response.data.userId || response.data.user,
                    email: xAuthUser,
                    accessToken,
                    role: response.data.role || 'ROLE_USER',
                };
                console.log('Login processed user data:', userData);
                // [수정] 로그인 성공 시 state와 로컬 스토리지에 전체 userData 저장
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return response;
            }
            throw new Error('로그인 데이터가 없습니다.');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (user) {
                await authAPI.logout({
                    email: user.email,
                    accessToken: user.accessToken
                });
            }

            // 로그아웃 시 state와 로컬 스토리지에서 user 제거
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        console.log('User state changed:', user);
        if (user) {
            console.log('Current user:', user);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const LoginButton = () => {
    const { login } = useAuth();
    const handleLogin = () => {
        login({ id: 'testUser', password: 'password' });
    };
    return (
        <button onClick={handleLogin}>
            로그인
        </button>
    );
};

export default LoginButton;