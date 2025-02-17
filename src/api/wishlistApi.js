// src/api/wishlistApi.js
import axios from "axios";
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
        console.log('Using headers:', {
            "X-Auth-User": authData.email,
            "Authorization": authData.accessToken
        });
        console.log('page:', page, 'size:', size);
        return response.data;
    } catch (error) {
        console.error("찜한 상품을 불러오는 중 오류 발생:", error);
        return { totalPages: 0, wishlist: [] };
    }
};

// 위시리스트 추가 API
export const toggleWish = async (email, pdtId, pdtName, pdtPrice) => {
    try {
        const response = await api.post('http://13.208.145.12:8080/wishlist', {
            email: email,
            pdtId: pdtId,
            pdtName: pdtName,
            pdtPrice: pdtPrice
        });
        return response.data; // 추가된 위시리스트 항목 반환
    } catch (error) {
        console.error("위시리스트 추가 중 오류 발생:", error);
        throw error; // 오류 발생 시 예외를 던짐
    }
};

// 찜 목록에서 삭제
export const toggleWishdel = async (email, id) => {
    try {
        const response = await api.delete(`http://13.208.145.12:8080/wishlist/${id}`, {
            headers: {
                "X-Auth-User": email
            }
        });
        return response.data; // 삭제된 위시리스트 항목 반환
    } catch (error) {
        console.error("위시리스트 삭제 중 오류 발생:", error);
        throw error; // 오류 발생 시 예외를 던짐
    }
};
