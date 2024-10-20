import React, { useState } from "react";
import "./cardshop.scss";
import { FaInfoCircle } from "react-icons/fa";

interface CardShopProps {
    imgSrc: string;
    title: string;
    price: number | string;
    description: string;
    className?: string;
    onClick?: () => void;
}

const CardShop: React.FC<CardShopProps> = ({
    imgSrc,
    title,
    price,
    description,
    className,
    onClick,
}) => {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <main className={`cardshop-wrapper ${className}`}>
            <section className="cardshop-card">
                <section className="cardshop-container">
                    <div
                        className="cardshop-info"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                    >
                        <FaInfoCircle />
                        {showInfo && (
                            <div className="info-popup">
                                <p>{description}</p>
                            </div>
                        )}
                    </div>
                    <section className="cardshop-details">
                        <div className="cardshop-banner">
                            <img src={imgSrc} alt={title} />
                        </div>
                        <h1>{title}</h1>
                        <button onClick={onClick}>
                            <img
                                src="/assets/images/reward/reward-currency.webp"
                                className="icon"
                            ></img>
                            {price}
                        </button>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardShop;
