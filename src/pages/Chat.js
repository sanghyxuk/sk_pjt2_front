import React, { useEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [chatRooms, setChatRooms] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const chatEndRef = useRef(null);
    const stompClientRef = useRef(null);

    // ✅ 로그인한 사용자 이메일 가져오기
    useEffect(() => {
        const storedUserEmail = localStorage.getItem("X-Auth-User");
        if (storedUserEmail) {
            setUserEmail(storedUserEmail);
        } else {
            console.warn("⚠ 로그인한 사용자 정보를 찾을 수 없습니다.");
        }
    }, []);

    // ✅ 채팅방 목록 불러오기
    useEffect(() => {
        if (!userEmail) return;

        console.log("채팅방 목록 조회중...");
        axios.get("http://13.208.145.12:8080/room/list", { headers: { "X-Auth-User": userEmail } })
            .then(res => setChatRooms(res.data))
            .catch(err => console.log(err));
        console.log("채팅방 목록 조회완료");
    }, [userEmail]);

    // ✅ WebSocket 연결 (selectedChat이 변경될 때마다)
    useEffect(() => {
        if (!selectedChat || !userEmail) return;

        console.log(`서버 연결 시도 - 사용자: ${userEmail}`);

        const stompClient = new Client({
            brokerURL: 'ws://56.155.12.67:8070/ws-stomp',
            debug: (str) => console.log("🟢 WebSocket Debug:", str),
            reconnectDelay: 5000000,
            connectHeaders: { "sender": userEmail }
        });

        stompClient.onConnect = function (frame) {
            console.log("✅ WebSocket 연결 성공");
            stompClient.subscribe(`/sub/chat/room/${selectedChat}`, chatting, { id: `cus-${selectedChat}` });

            axios.get(`http://13.208.145.12:8080/chat/room/${selectedChat}`)
                .then(response => {
                    console.log("✅ 채팅 내역 불러오는 중...");
                    let msg = response.data.map(c => ({
                        context: c.content,
                        isMe: userEmail === c.sender
                    }));
                    console.log("✅ 채팅 내역 조회 완료");
                    setMessages(msg);
                });
        };

        stompClient.onStompError = function (frame) {
            console.error("❌ STOMP 오류 발생:", frame);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [selectedChat, userEmail]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ WebSocket 메시지 수신
    const chatting = function (response) {
        console.log("✅ 메시지 도착:", response.body);
        if (response.body) {
            const res = JSON.parse(response.body);
            const msg = {
                context: res.content,
                isMe: userEmail === res.sender
            };
            setMessages(messages => [...messages, msg]);
        }
    };

    // ✅ 메시지 전송
    const handleSendMessage = () => {
        if (inputMessage.trim() === "" || !stompClientRef.current || !selectedChat) return;

        const message = {
            roomUUID: selectedChat,
            sender: userEmail,
            content: inputMessage
        };

        stompClientRef.current.publish({
            destination: `/pub/room/${selectedChat}/message`,
            body: JSON.stringify(message),
        });

        setInputMessage("");
    };

    // ✅ 현재 선택된 채팅방 정보 가져오기
    const currentChatRoom = chatRooms.find(room => room.room.roomUUID === selectedChat);
    const chatRoomTitle = currentChatRoom ? currentChatRoom.other : "채팅방을 선택하세요";

    return (
        <div style={{ display: "flex", height: "80vh", backgroundColor: "#f7f7f7" }}>
            {/* ✅ 채팅방 목록 */}
            <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px", backgroundColor: "#fff" }}>
                <h3>채팅방 목록</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {chatRooms.map((room) => (
                        <li key={room.room.roomUUID}
                            style={{
                                cursor: "pointer",
                                padding: "10px",
                                background: selectedChat === room.room.roomUUID ? "#dfe6e9" : "transparent",
                                borderRadius: "5px",
                                marginBottom: "5px"
                            }}
                            onClick={() => setSelectedChat(room.room.roomUUID)}>
                            {room.other} {/* ✅ 상대방 이메일 표시 */}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ✅ 채팅 UI */}
            <div style={{ width: "70%", padding: "15px", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                {selectedChat ? (
                    <>
                        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                            채팅방 - {chatRoomTitle} {/* ✅ 채팅방 이름을 상대방 이메일로 변경 */}
                        </h3>
                        <div style={{ flexGrow: 1, border: "1px solid #ccc", padding: "10px", overflowY: "auto", borderRadius: "5px", backgroundColor: "#fafafa", height: "60vh" }}>
                            {messages.map((message, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: message.isMe ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                                    <p style={{ maxWidth: "60%", padding: "10px", borderRadius: "10px", backgroundColor: message.isMe ? "#81c784" : "#e0e0e0", color: message.isMe ? "white" : "black" }}>
                                        {message.context}
                                    </p>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>
                        <div style={{ display: "flex", marginTop: "10px" }}>
                            <input type="text"
                                   value={inputMessage}
                                   onChange={(e) => setInputMessage(e.target.value)}
                                   placeholder="메시지를 입력하세요..."
                                   style={{ flexGrow: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}
                                    style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>전송</button>
                        </div>
                    </>
                ) : (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>채팅방을 선택하세요.</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
