import React from "react";
import { Link } from "react-router-dom";
import "../styles/ChatRoomItem.css";

const ChatRoomItem = ({ roomId, name, lastMessage }) => {
    return (
        <Link to={`/chat/${roomId}`} className="chat-room">
            <div className="chat-room-details">
                <h3 className="chat-room-name">{name}</h3>
                <p className="chat-room-last">{lastMessage}</p>
            </div>
        </Link>
    );
};

export default ChatRoomItem;
