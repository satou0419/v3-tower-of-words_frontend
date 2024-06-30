import React from "react";
import "./cardmode.scss";
import CardInfo from "../CardInfo/CardInfo";
import CardDetails from "../CardDetails/CardDetails";

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

                    <CardInfo title={progressHeader} counter={progressValue} />

                    <CardDetails
                        title={modeTitle}
                        description={modeDescription}
                    />
                </section>
            </section>
        </main>
    );
};

export default CardMode;
