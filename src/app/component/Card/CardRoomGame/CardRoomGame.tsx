// CardRoomGame.tsx
import React from "react";
import CardDetails from "../CardDetails/CardDetails";
import CardInfo from "../CardInfo/CardInfo";
import "./cardroomgame.scss";
import Link from "next/link";

interface CardRoomGameProps {
    bannerClass: string;
    title: string;
    description: string;
    infoTitle: string;
    counter: number;
    glow: boolean;
    link?: string;
    onClick: () => void;
}

const CardRoomGame: React.FC<CardRoomGameProps> = ({
    bannerClass,
    title,
    description,
    infoTitle,
    counter,
    glow,
    link = "#",
    onClick,
}) => {
    return (
        <Link className="cardroomgame-card" href={link} onClick={onClick}>
            <section className="cardroomgame-container">
                <section className={`cardroomgame-banner ${bannerClass}`}>
                    <div className="banner-container"></div>
                </section>
                <CardDetails title={title} description={description} />
                <CardInfo title={infoTitle} counter={counter} glow={glow} />
            </section>
        </Link>
    );
};

export default CardRoomGame;
