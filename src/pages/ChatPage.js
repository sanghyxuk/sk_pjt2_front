import React, { useEffect, useState } from "react";
import { getChatMessages, sendMessage } from "../api/chatApi";
import { useParams } from "react-router-dom";
import "../styles/ChatPage.css";

const ChatPage = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const userId = 1; // 임시 유저 ID

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const data = await getChatMessages(roomId);
        setMessages(data);
    };

    const handleSendMessage = async () => {
        if (message.trim() !== "") {
            await sendMessage(roomId, message, userId);
            setMessages([...messages, { senderId: userId, message }]);
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <h2>채팅방</h2>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.senderId === userId ? "sent" : "received"}`}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatPage;
