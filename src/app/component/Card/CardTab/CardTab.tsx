import React from "react";
import "./cardtab.scss";

interface CardTabProps {
    title: string;
    subtitle?: string;
    counter?: string;
    className?: string;
    children?: React.ReactNode;
}

const CardTab: React.FC<CardTabProps> = ({
    title,
    subtitle,
    counter,
    className,
    children,
}) => {
    return (
        <section className={`cardtab-card ${className}`}>
            <section className="cardtab-title">
                <section className="container">
                    <h1>{title}</h1>
                    {subtitle && (
                        <section className="details">
                            <h1>{subtitle}</h1>
                            {counter && <span>{counter}</span>}
                        </section>
                    )}
                </section>
            </section>
            <section className="cardtab-content">
                <section className="content">{children}</section>
            </section>
        </section>
    );
};

export default CardTab;
