import React from "react";
import "./cardinfo.scss";

interface CardInfoProps {
    className?: string;
    title: string;
    counter: number;
    glow?: boolean;
    variant?: "default" | "alternate";
}

const CardInfo: React.FC<CardInfoProps> = ({
    className,
    title,
    counter,
    glow = false,
    variant = "default",
}) => {
    return (
        <main className={className}>
            <section
                className={`cardinfo-card ${variant} ${glow ? "glow" : ""}`}
            >
                <h1>{title}</h1>
                <span>{counter}</span>
            </section>
        </main>
    );
};

export default CardInfo;
