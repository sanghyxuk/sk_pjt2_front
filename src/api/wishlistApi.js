// src/api/wishlistApi.js
import api from "./axios";

export const getWishlistItems = async (page = 1, size = 3, authData) => {
    try {
        const response = await api.get('/myPage/wishList', {
            params: { page, size },
            headers: {
                "X-Auth-User": authData.email,
                "Authorization": authData.accessToken
            }
        });
        return response.data;
    } catch (error) {
        console.error("찜한 상품을 불러오는 중 오류 발생:", error);
        return { totalPages: 0, wishlist: [] };
    }
};

export const toggleWish = async (email, pdtId, pdtName, pdtPrice, accessToken) => {
    try {
        const response = await api.post('/wishlist', {
            email,
            pdtId,
            pdtName,
            pdtPrice
        }, {
            headers: {
                "X-Auth-User": email,
                "Authorization": accessToken,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("위시리스트 추가 중 오류 발생:", error);
        throw error;
    }
};

export const toggleWishdel = async (email, pdtId, accessToken) => {
    try {
        const response = await api.delete(`/wishlist/${pdtId}`, {
            headers: {
                "X-Auth-User": email,
                "Authorization": accessToken
            }
        });
        return response.data;
    } catch (error) {
        console.error("위시리스트 삭제 중 오류 발생:", error);
        throw error;
    }
};