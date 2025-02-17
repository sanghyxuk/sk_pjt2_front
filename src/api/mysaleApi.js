// src/api/mysaleApi.js
import api from './axios';


export const getMySaleItems = async (page, size, authData) => {
    try {
        // get 요청
        const response = await api.get('/myPage/mySale', {
            params: { page, size },
            headers: {
                'X-Auth-User': authData.email,
                'Authorization': authData.accessToken,
            },
        });
        return response.data.sales; // sales 배열 반환
    } catch (error) {
        console.error("판매한 물품을 불러오는 중 오류 발생:", error);
        return [];
    }
};
