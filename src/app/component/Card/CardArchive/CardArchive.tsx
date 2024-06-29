import React from "react";
import "./cardarchive.scss";

interface CardArchiveProps {
    archiveTitle?: string;
    archiveDescription?: string;
    badgesCount?: number;
    wordsCount?: number;
}

const CardArchive: React.FC<CardArchiveProps> = ({
    archiveTitle = "Archive",
    archiveDescription = "Conquer the Towers! Collect Words and Badges in Adventure Mode",
    badgesCount = 4,
    wordsCount = 4,
}) => {
    return (
        <main>
            <section className="cardarchive-container">
                <section className="cardarchive-card">
                    <section className="cardarchive-details_container">
                        <section className="cardarchive-banner">
                            <div className="outer">
                                <div className="inner"></div>
                            </div>
                        </section>

                        <section className="cardarchive-details">
                            <h1>{archiveTitle}</h1>
                            <span>{archiveDescription}</span>
                        </section>
                    </section>

                    <section className="cardarchive-collection_container">
                        <section className="cardarchive-collection">
                            <h1>Badges</h1>
                            <span>{badgesCount}</span>
                        </section>
                        <section className="cardarchive-collection">
                            <h1>Words</h1>
                            <span>{wordsCount}</span>
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardArchive;
