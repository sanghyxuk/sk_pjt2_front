import axios from "axios";

const BASE_URL = "http://localhost:8080/wishlist"; // 백엔드 API 주소

// 찜 목록 가져오기
export const getWishlistItems = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("찜 목록을 불러오는 중 오류 발생:", error);
        return [];
    }
};

// 찜 목록에서 삭제
export const removeWishlistItem = async (userId, itemId) => {
    try {
        await axios.delete(`${BASE_URL}/${userId}/${itemId}`);
    } catch (error) {
        console.error("찜한 상품 삭제 중 오류 발생:", error);
    }
};
