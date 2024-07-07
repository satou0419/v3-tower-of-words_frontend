import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./studentassessment.scss";

export default function StudentAssessment() {
    return (
        <main className="studentassessment-wrapper">
            <section className="studentassessment-container">
                <button type="button">Back</button>
                <CardTab
                    className="cardtab"
                    title="Student Assessment"
                    subtitle="Username"
                >
                    <section className="studentassessment-content">
                        <section className="studentassessment-details">
                            <span>Firstname, Lastname</span>
                            <span>Duration: </span>
                            <span>Date: </span>
                            <span>Average Time: </span>
                            <span>Score: </span>
                        </section>
                        <section className="studentassessment-graph">
                            Graph here...
                        </section>
                    </section>
                </CardTab>
            </section>
        </main>
    );
}
