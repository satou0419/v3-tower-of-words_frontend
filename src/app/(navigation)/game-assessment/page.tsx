import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./gameassessment.scss";

export default function GameAssessment() {
    return (
        <main className="gameassessment-wrapper">
            <section className="gameassessment-container">
                <button type="button">Back</button>
                <CardTab
                    className="cardtab"
                    title="Game Assessment"
                    subtitle="Username"
                >
                    <section className="gameassessment-content">
                        <section className="gameassessment-details">
                            <span>Firstname, Lastname</span>
                            <span>Duration: </span>
                            <span>Date: </span>
                            <span>Average Time: </span>
                            <span>Score: </span>
                        </section>
                        <section className="gameassessment-graph">
                            Graph here...
                        </section>
                    </section>
                </CardTab>
            </section>
        </main>
    );
}
