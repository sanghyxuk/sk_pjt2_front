import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI } from '../api/auth'; // 실제 API를 사용할 경우 주석 해제
import { users } from '../data/dummyData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    // 인증 상태를 확인하는 로직 (API 호출)
    try {
      console.log('Starting checkAuth with current user:', user);
      // const response = await authAPI.checkAuth(); // 실제 API 호출 (주석 해제 시 사용)

      // 주석 처리된 부분으로 API 호출을 대체
      const response = { data: user }; // 예시로 현재 사용자 상태를 반환
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
      if (user) {
        console.log('Keeping existing user state on error');
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   const login = async (credentials) => {
   try {
   const response = await authAPI.login(credentials.id, credentials.password); // 실제 로그인 API 호출 (주석 해제 시 사용)
   console.log('Login response:', response.data);

   if (response.data) {
   const userData = {
   ...response.data,
   userId: response.data.userId || response.data.user,
   role: response.data.role || 'ROLE_USER'
   };
   console.log('Login processed user data:', userData);
   setUser(userData);
   return response.data;
   }
   throw new Error('로그인 데이터가 없습니다.');
   } catch (error) {
   console.error('Login error:', error);
   throw error;
   }
   };
   */

      // 하드코딩된 사용자 데이터로 로그인 처리
  const login = (username, password) => {
        if (username === 'testUser' && password === 'password') {
          setUser({
            userId: 1,
            username: 'testUser',
            email: 'test@example.com',
          });
          console.log('User logged in:', {
            userId: 1,
            username: 'testUser',
            email: 'test@example.com',
          });
        } else {
          console.error('Invalid credentials');
        }
      };

  const logout = async () => {
    try {
      // await authAPI.logout(); // 실제 API 호출 (주석 해제 시 사용)
      setUser(null);
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
    if (user?.userId) {
      console.log('Current userId:', user.userId);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem('userId', user.userId);
      console.log('Saved userId to localStorage:', user.userId);
    }
  }, [user]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId && user && !user.userId) {
      setUser(prevUser => ({
        ...prevUser,
        userId: savedUserId
      }));
      console.log('Restored userId from localStorage:', savedUserId);
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

// 로그인 버튼 컴포넌트 예시
const LoginButton = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    login('testUser', 'password'); // 하드코딩된 사용자로 로그인
  };

  return (
      <button onClick={handleLogin}>
        로그인
      </button>
  );
};

export default LoginButton;
