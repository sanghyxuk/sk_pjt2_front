import React, { useEffect, useState } from "react";
import { getWishlistItems, removeWishlistItem } from "../api/wishlistApi";
import WishlistItem from "../components/WishlistItem";
import Navbar from "../components/Navbar";
import "../styles/WishlistPage.css";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const userId = 1; // 임시 유저 ID

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const data = await getWishlistItems(userId);
        setWishlist(data);
    };

    const handleRemove = async (id) => {
        await removeWishlistItem(userId, id);
        setWishlist(wishlist.filter((item) => item.id !== id));
    };

    return (
        <div>
            <Navbar />
            <div className="wishlist-container">
                <h2>찜 목록</h2>
                <div className="wishlist-list">
                    {wishlist.length > 0 ? (
                        wishlist.map((item) => <WishlistItem key={item.id} {...item} onRemove={handleRemove} />)
                    ) : (
                        <p className="empty-message">찜한 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
