import React from "react";
import "./cardarchive.scss";
import CardWord from "../CardWord/CardWord";
import CardInfo from "../CardInfo/CardInfo";
import CardDetails from "../../CardDetails/CardDetails";

interface CardArchiveProps {
    badgesCount: number;
    wordsCount: number;
}

const CardArchive: React.FC<CardArchiveProps> = ({
    badgesCount,
    wordsCount,
}) => {
    return (
        <main>
            <section className="cardarchive-container">
                <section className="cardarchive-card">
                    <section className="cardarchive-details_container">
                        <CardWord />
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
                        />
                        <CardInfo
                            title="Words"
                            counter={wordsCount}
                            variant="alternate"
                            glow={true}
                        />
                    </section>
                </section>
            </section>
        </main>
    );
};

export default CardArchive;
