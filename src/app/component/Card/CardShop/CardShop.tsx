import React from "react";
import "./cardshop.scss";
import { FaInfoCircle } from "react-icons/fa";

interface CardShopProps {
    imgSrc: string;
    title: string;
    price: number | string;
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
                    <div className="cardshop-info">
                        <FaInfoCircle />
                    </div>
                    <section className="cardshop-details">
                        <div className="cardshop-banner">
                            <img src={imgSrc} alt={title} />
                        </div>
                        <h1>{title}</h1>
                        <button onClick={onClick}>
                            <img src="/assets/images/reward/reward-currency.webp" className="icon"></img>
                            {price}
                        </button>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardShop;
