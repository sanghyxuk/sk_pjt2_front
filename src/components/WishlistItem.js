import React from "react";
import "../styles/WishlistItem.css";

const WishlistItem = ({ id, title, price, imageUrl, onRemove }) => {
    return (
        <div className="wishlist-item">
            <img src={imageUrl} alt={title} className="wishlist-item-image" />
            <div className="wishlist-item-details">
                <h3 className="wishlist-item-title">{title}</h3>
                <p className="wishlist-item-price">{price.toLocaleString()} 원</p>
            </div>
            <button className="wishlist-remove-btn" onClick={() => onRemove(id)}>
                삭제
            </button>
        </div>
    );
};

export default WishlistItem;
