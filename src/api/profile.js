// src/api/profile.js
import api from './axios';

export const profileAPI = {
    // 사용자 전체 프로필 정보를 가져오는 GET API 함수
    getProfile: (authData) => {
        return api.get('/user/modify', { // 백엔드 엔드포인트 (예시)
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-User': authData.email,          // 로그인 시 저장된 사용자 이메일
                'Authorization': authData.accessToken   // 로그인 시 저장된 액세스 토큰
            }
        });
    },

    // 사용자 프로필 정보를 수정하는 POST API 함수 (참고용)
    updateProfile: (profileData, authData) => {
        return api.post('/user/modify', profileData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-User': authData.email,
                'Authorization': authData.accessToken,
            }
        });
    }
};
