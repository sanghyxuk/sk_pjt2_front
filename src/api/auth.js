import api from './axios';

export const authAPI = {
    // 로그인 상태 확인
    checkAuth: () => api.get('/do'),

    // 로그인
    login: (userData) => {
        return api.post('http://56.155.23.170:8080/auth/login', {
            email: userData.email,
            password: userData.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    // 로그아웃
    logout: async (userData) => {
        try {
            const response = await api.post('/auth/logout', null, {
                headers: {
                    // 로그아웃 시 이메일, 액세스 토큰을 헤더에 추가
                    'X-Auth-User': userData.email,
                    'Authorization': userData.accessToken,
                    'Content-Type': 'application/json'
                }
            });

            // 모든 쿠키 삭제
            const cookies = document.cookie.split(';');

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            }

            return response;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // 회원가입 (JSON 방식)
    signup: (userData) => {
        return api.post('http://56.155.23.170:8080/user/signup', {
            email: userData.email,
            userName: userData.userName,
            password: userData.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};