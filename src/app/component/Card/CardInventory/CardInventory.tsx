import React from "react";
import "./cardinventory.scss";

interface CardInventoryProps {
    imgSrc: string;
    title: string;
    description: string;
    quantity: number | string;
    className?: string;
    onClick?: () => void;
}

const CardInventory: React.FC<CardInventoryProps> = ({
    imgSrc,
    title,
    description,
    quantity,
    className,
    onClick,
}) => {
    return (
        <main className="cardinventory-wrapper">
            <section
                className={`cardinventory-card ${className}`}
                onClick={onClick}
            >
                <section className="cardinventory-item_details">
                    <div className="cardinventory-banner">
                        <img src={imgSrc} alt={title} />
                    </div>

                    <div className="cardinventory-description">
                        <h1>{title}</h1>
                        <span>{description}</span>
                    </div>
                </section>

                <section className="cardinventory-quantity">
                    <span>{quantity}x</span>
                </section>
            </section>
        </main>
    );
};

export default CardInventory;
