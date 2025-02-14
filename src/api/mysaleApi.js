//import axios from "axios";
import api from "./axios";
//const BASE_URL = "http://localhost:8080/mypurchase"; // 백엔드 API 주소

export const getMySaleItems = async (page = 0, size = 10, email) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await api.get(`/myPage//mySale?page=${page}&size=${size}`, {
            headers: {
                "X-Auth-User": email
            }
        });
        return response.data;
    } catch (error) {
        console.error("판매한 물품을 불러오는 중 오류 발생:", error);
        return [];
    }
};
