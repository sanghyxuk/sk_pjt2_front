import React from "react";
import "../styles/MyPurchaseItem.css";

const MyPurchaseItem = ({ title, price, imageUrl, seller, purchaseDate }) => {
    return (
        <div className="purchase-item">
            <img src={imageUrl} alt={title} className="purchase-item-image" />
            <div className="purchase-item-details">
                <h3 className="purchase-item-title">{title}</h3>
                <p className="purchase-item-price">{price.toLocaleString()} 원</p>
                <p className="purchase-item-seller">판매자: {seller}</p>
                <p className="purchase-item-date">구매일: {purchaseDate}</p>
            </div>
        </div>
    );
};

export default MyPurchaseItem;
