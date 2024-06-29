import React from "react";
import "./cardmode.scss";

interface CardModeProps {
    className?: string;
    bannerSrc?: string;
    progressHeader?: string;
    progressValue?: number;
    modeTitle?: string;
    modeDescription?: string;
}

const CardMode: React.FC<CardModeProps> = ({
    className,
    bannerSrc = "/assets/images/banner/banner-adventure_large.webp",
    progressHeader = "Floors Completed",
    progressValue = 1,
    modeTitle = "Adventure",
    modeDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing",
}) => {
    return (
        <main className={`${className ? className : ""}`}>
            <section className="cardmode-container">
                <section className="cardmode-card">
                    <section className="cardmode-banner">
                        <img src={bannerSrc} alt="Banner" />
                    </section>

                    <section className="cardmode-progress">
                        <h1>{progressHeader}</h1>
                        <span>{progressValue}</span>
                    </section>

                    <section className="cardmode-info">
                        <h1>{modeTitle}</h1>
                        <span>{modeDescription}</span>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardMode;
