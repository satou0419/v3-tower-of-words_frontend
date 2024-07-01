import React from "react";
import Link from "next/link";
import "./cardnew.scss";

interface CardNewProps {
    title: string;
    link: string;
}

const CardNew: React.FC<CardNewProps> = ({ title, link }) => {
    return (
        <Link className="cardnew-card" href={link}>
            <h1>{title}</h1>
        </Link>
    );
};

export default CardNew;
