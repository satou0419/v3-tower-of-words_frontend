import React from "react";
import CardInfo from "../CardInfo/CardInfo";
import "./cardcharacter.scss";
import CardWord from "@/app/component/Card/CardWord/CardWord";

interface CardCharacterProps {
    bannerClass: string;
    directory?: string;
    equip?: boolean;
    owned?: boolean;
    infoTitle: string;
    price?: number;
    onClick: () => void;
    onBuyClick?: () => void;
}

const CardCharacter: React.FC<CardCharacterProps> = ({
    bannerClass,
    directory,
    equip,
    owned,
    infoTitle,
    price,
    onClick,
    onBuyClick,
}) => {
    return (
        <div className="cardcharacter-card" onClick={onClick}>
            <section className="cardcharacter-container">
                {equip && <div className="equip-banner">Equipped</div>}
                {owned && <div className="sold-banner">Sold</div>} 
                <CardWord className={`cardcharacter-banner ${bannerClass}`}>
                    <div className="banner-container">
                        <img src={bannerClass} />
                    </div>
                </CardWord>
                {directory === "Inventory" && (
                    <section className="cardinfo-inventory">
                        <CardInfo title={infoTitle} />
                    </section>
                )}

                {directory === "Shop" && (
                    <section className="cardinfo-shop">
                        {infoTitle}
                        <button className="buy-button" onClick={onBuyClick} disabled={owned}>
                            <img src="/assets/images/reward/reward-currency.webp" className="icon"></img>
                            {price}</button>
                    </section>
                )}
            </section>
        </div>
    );
};

export default CardCharacter;
