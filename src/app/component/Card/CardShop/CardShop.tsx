import React from "react";
import "./cardshop.scss";

interface CardShopProps {
    imgSrc: string;
    title: string;
    price: number;
    className?: string;
    onClick?: () => void;
}

const CardShop: React.FC<CardShopProps> = ({
    imgSrc,
    title,
    price,
    className,
    onClick,
}) => {
    return (
        <main className={`cardshop-wrapper ${className}`}>
            <section className="cardshop-card">
                <section className="cardshop-container">
                    <div className="cardshop-info">ℹ️</div>
                    <section className="cardshop-details">
                        <div className="cardshop-banner">
                            <img src={imgSrc} alt={title} />
                        </div>
                        <h1>{title}</h1>
                        <button onClick={onClick}>{price}</button>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardShop;
