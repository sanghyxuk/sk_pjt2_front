import React, { useEffect, useState } from "react";
import { getChatRooms } from "../api/chatApi";
import ChatRoomItem from "../components/ChatRoomItem";
import Navbar from "../components/Navbar";
import "../styles/ChatListPage.css";

const ChatListPage = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const userId = 1; // 임시 유저 ID

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const fetchChatRooms = async () => {
        const data = await getChatRooms(userId);
        setChatRooms(data);
    };

    return (
        <div>
            <Navbar />
            <div className="chat-list-container">
                <h2>채팅 목록</h2>
                <div className="chat-list">
                    {chatRooms.length > 0 ? (
                        chatRooms.map((room) => <ChatRoomItem key={room.roomId} {...room} />)
                    ) : (
                        <p className="empty-message">진행 중인 채팅이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListPage;
