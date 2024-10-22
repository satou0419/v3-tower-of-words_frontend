import React from "react";
import CardDetails from "../CardDetails/CardDetails";
import CardInfo from "../CardInfo/CardInfo";
import "./cardroomgame.scss";

interface CardRoomGameProps {
    bannerClass: string;
    title: string;
    description: string;
    infoTitle: string;
    counter: number;
    glow: boolean;
    onClick: () => void;
}

const CardRoomGame: React.FC<CardRoomGameProps> = ({
    bannerClass,
    title,
    description,
    infoTitle,
    counter,
    glow,
    onClick,
}) => {
    console.log(bannerClass);
    return (
        <div className="cardroomgame-card" onClick={onClick}>
            <section className="cardroomgame-container">
                <section className={`cardroomgame-banner ${bannerClass}`}>
                    <div className="banner-container">
                        <img src={bannerClass} alt="" />
                    </div>
                </section>
                <CardDetails title={title} description={description} />
                <CardInfo title={infoTitle} counter={counter} glow={glow} />
            </section>
        </div>
    );
};

export default CardRoomGame;
