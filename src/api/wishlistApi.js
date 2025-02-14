import axios from "axios";
import api from "./axios";
//const BASE_URL = "http://localhost:8080/mypurchase"; // 백엔드 API 주소

export const getWishlistItems = async (page = 0, size = 10, email) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await api.get(`/myPage/wishList?page=${page}&size=${size}`, {
            headers: {
                "X-Auth-User": email
            }
        });
        return response.data;
    } catch (error) {
        console.error("찜한 상품을 불러오는 중 오류 발생:", error);
        return [];
    }
};


// 찜 목록에서 삭제
export const removeWishlistItem = async (page = 0, size = 10, email, itemId) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        await axios.delete(`/myPage/wishList?page=${page}&size=${size}`);
    } catch (error) {
        console.error("찜한 상품 삭제 중 오류 발생:", error);
    }
};
