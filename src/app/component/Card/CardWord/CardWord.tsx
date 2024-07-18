import React, { ReactNode, useState } from "react";
import "./cardword.scss";

interface CardWordProps {
    className?: string;
    children?: ReactNode;
}

const CardWord: React.FC<CardWordProps> = ({ className, children }) => {
    return (
        <main className={className}>
            <section className="cardword-card">
                <div className="outer">
                    <div className="inner">{children}</div>
                </div>
            </section>
        </main>
    );
};

export default CardWord;