// CardRoomGame.tsx
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
}

const CardRoomGame: React.FC<CardRoomGameProps> = ({
    bannerClass,
    title,
    description,
    infoTitle,
    counter,
    glow,
}) => {
    return (
        <section className="cardroomgame-card">
            <section className="cardroomgame-container">
                <section className={`cardroomgame-banner ${bannerClass}`}>
                    <div className="banner-container"></div>
                </section>
                <CardDetails title={title} description={description} />
                <CardInfo title={infoTitle} counter={counter} glow={glow} />
            </section>
        </section>
    );
};

export default CardRoomGame;
