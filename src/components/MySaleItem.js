// src/components/MySaleItem.js
import React from "react";
import "../styles/MySaleItem.css";

const MySaleItem = ({ pdtName, price, imageUrl, status }) => {
    return (
        <div className="sale-item">
            <img src={imageUrl} alt={pdtName} className="sale-item-image" />
            <div className="sale-item-details">
                <h3 className="sale-item-title">{pdtName}</h3>
                <p className="sale-item-price">{price.toLocaleString()} 원</p>
                <span className={`status ${status === "판매 완료" ? "sold" : "on-sale"}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default MySaleItem;
