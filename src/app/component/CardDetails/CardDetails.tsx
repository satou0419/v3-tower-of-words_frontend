import React from "react";
import "./carddetails.scss";

interface CardDetailsProps {
    className?: string;
    title: string;
    description: string;
    variant?: "default" | "alternate";
}

const CardDetails: React.FC<CardDetailsProps> = ({
    className,
    title,
    description,
    variant = "default",
}) => {
    return (
        <main>
            <section className={`carddetails-card ${variant} ${className}`}>
                <h1>{title}</h1>
                <span>{description}</span>
            </section>
        </main>
    );
};

export default CardDetails;
