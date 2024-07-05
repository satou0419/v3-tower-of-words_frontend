import React from "react";
import "./carduser.scss";

interface CardUserProps {
    username: string;
    time: string;
    score: number;
    className?: string;
}

const CardUser: React.FC<CardUserProps> = ({
    username,
    time,
    score,
    className,
}) => {
    return (
        <section className={`carduser-card ${className || ""}`}>
            <section className="carduser-container">
                <section className="banner-container">
                    <div className="banner"></div>

                    <div className="details">
                        <h1>{username}</h1>
                        <span>{time}</span>
                    </div>
                </section>

                <section className="user-info">
                    <h1>Score</h1>
                    <span>{score}</span>
                </section>
            </section>
        </section>
    );
};

export default CardUser;
