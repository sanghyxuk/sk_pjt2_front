import axios from "axios";

const BASE_URL = "http://localhost:8080/chat"; // 백엔드 API 주소

// 채팅 목록 가져오기
export const getChatRooms = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/rooms/${userId}`);
        return response.data;
    } catch (error) {
        console.error("채팅 목록을 불러오는 중 오류 발생:", error);
        return [];
    }
};

// 채팅 메시지 가져오기
export const getChatMessages = async (roomId) => {
    try {
        const response = await axios.get(`${BASE_URL}/messages/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("채팅 메시지를 불러오는 중 오류 발생:", error);
        return [];
    }
};

// 메시지 전송
export const sendMessage = async (roomId, message, senderId) => {
    try {
        await axios.post(`${BASE_URL}/send`, { roomId, message, senderId });
    } catch (error) {
        console.error("메시지 전송 중 오류 발생:", error);
    }
};
