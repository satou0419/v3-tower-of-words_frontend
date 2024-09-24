import React from "react";
import "./cardinfo.scss";
import Link from "next/link";

interface CardInfoProps {
    className?: string;
    title?: string;
    counter?: number;
    glow?: boolean;
    link?: string;
    variant?: "default" | "alternate";
}

const CardInfo: React.FC<CardInfoProps> = ({
    className,
    title,
    counter,
    glow = false,
    link,
    variant = "default",
}) => {
    const content = (
        <section className={`cardinfo-card ${variant} ${glow ? "glow" : ""}`}>
            <h1>{title}</h1>
            <span>{counter}</span>
        </section>
    );

    return (
        <main className={className}>
            {link ? <Link href={link}>{content}</Link> : content}
        </main>
    );
};

export default CardInfo;
