import axios from "axios";

const BASE_URL = "http://localhost:8080/mysale"; // 백엔드 API 주소

// 내가 판매한 물품 목록 가져오기
export const getMySaleItems = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("판매한 물품을 불러오는 중 오류 발생:", error);
        return [];
    }
};
