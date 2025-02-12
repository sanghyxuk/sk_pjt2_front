import React, { useEffect, useState } from "react";
import { getMySaleItems } from "../api/mysaleApi";
import MySaleItem from "../components/MySaleItem";
import Navbar from "../components/Navbar";
import "../styles/MySalePage.css";

const MySalePage = () => {
    const [mySales, setMySales] = useState([]);
    const userId = 1; // 임시 ID

    useEffect(() => {
        fetchMySales();
    }, []);

    const fetchMySales = async () => {
        const data = await getMySaleItems(userId);
        setMySales(data);
    };

    return (
        <div>
            <Navbar />
            <div className="mysale-container">
                <h2>내가 판매한 물품</h2>
                <div className="mysale-list">
                    {mySales.length > 0 ? (
                        mySales.map((item) => <MySaleItem key={item.id} {...item} />)
                    ) : (
                        <p className="empty-message">판매한 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MySalePage;
