import React from "react";
import "./cardarchive.scss";
import CardWord from "../CardWord/CardWord";
import CardInfo from "../CardInfo/CardInfo";
import CardDetails from "../CardDetails/CardDetails";

interface CardArchiveProps {
    badgeEquipped: string | null;
    badgesCount: number;
    wordsCount: number;
}

const CardArchive: React.FC<CardArchiveProps> = ({
    badgeEquipped,
    badgesCount,
    wordsCount,
}) => {
    return (
        <main>
            <section className="cardarchive-container">
                <section className="cardarchive-card">
                    <section className="cardarchive-details_container">
                        <CardWord className="badge-display">
                            {badgeEquipped && (
                                <img
                                    src={`/assets/images/badges/${badgeEquipped}_unlocked.png`}
                                    className="badge"
                                ></img>
                            )}
                        </CardWord>
                        <CardDetails
                            className="additional-class"
                            title="Archive"
                            description="Conquer the Towers! Collect Words and Badges in Adventure Mode"
                            variant="alternate"
                        />
                    </section>

                    <section className="cardarchive-collection_container">
                        <CardInfo
                            title="Badges"
                            counter={badgesCount}
                            variant="alternate"
                            glow={true}
                            link="/archive/badges"
                        />

                        <CardInfo
                            title="Words"
                            counter={wordsCount}
                            variant="alternate"
                            glow={true}
                            link="/archive/word-vocabulary"
                        />
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardArchive;
