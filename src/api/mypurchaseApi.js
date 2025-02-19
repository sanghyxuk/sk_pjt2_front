// src/api/mypurchaseApi.js
import api from "./axios";

export const getMyPurchaseItems = async (page = 1, size = 3, authData) => {
    try {
        // GET 요청
        const response = await api.get('/myPage/myPurchase', {
            params: { page, size },
            headers: {
                "X-Auth-User": authData.email,
                "Authorization": authData.accessToken
            }
        });
        console.log('Using headers:', {
            "X-Auth-User": authData.email,
            "Authorization": authData.accessToken
        });
        console.log('page:', page, 'size:', size);
        return response.data; // => { totalPages, sales }

        // 백엔드가 { totalPages, purchases: [...] } 형태로 준다고 가정
        return response.data; // 그대로 { totalPages, purchases }
    } catch (error) {
        console.error("구매한 물품을 불러오는 중 오류 발생:", error);
        return { totalPages: 0, purchases: [] };
    }
};
