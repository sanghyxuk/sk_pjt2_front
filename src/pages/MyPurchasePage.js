import React, { useEffect, useState } from "react";
import { getMyPurchaseItems } from "../api/mypurchaseApi";
import MyPurchaseItem from "../components/MyPurchaseItem";
import Navbar from "../components/Navbar";
import "../styles/MyPurchasePage.css";

const MyPurchasePage = () => {
    const [myPurchases, setMyPurchases] = useState([]);
    const userId = 1; // 임시 유저 ID

    useEffect(() => {
        fetchMyPurchases();
    }, []);

    const fetchMyPurchases = async () => {
        const data = await getMyPurchaseItems(userId);
        setMyPurchases(data);
    };

    return (
        <div>
            <Navbar />
            <div className="mypurchase-container">
                <h2>내가 구매한 물품</h2>
                <div className="mypurchase-list">
                    {myPurchases.length > 0 ? (
                        myPurchases.map((item) => <MyPurchaseItem key={item.id} {...item} />)
                    ) : (
                        <p className="empty-message">구매한 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPurchasePage;
