import axios from "axios";

const BASE_URL = "http://localhost:8080/mypurchase"; // 백엔드 API 주소

export const getMyPurchaseItems = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("구매한 물품을 불러오는 중 오류 발생:", error);
        return [];
    }
};
