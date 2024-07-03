import CardWord from "@/app/component/Card/CardWord/CardWord";
import "./spelling.scss";

export default function Spelling() {
    return (
        <main className="spelling-wrapper">
            <section className="spelling-container">
                <section className="spelling-upper">
                    <section className="reward">
                        <CardWord className="reward-container">
                            <h1>Floor 3</h1>

                            <section className="reward-list">
                                <h2>Rewards:</h2>

                                <section className="reward-item">
                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>

                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>

                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>
                                </section>
                            </section>

                            <button>Enter</button>
                        </CardWord>
                    </section>
                    <section className="tower">
                        <section className="spelling-banner">
                            <section className="floor-container">
                                <div className="floors">
                                    <span className="locked">Floor 5</span>
                                </div>
                                <div className="floors">
                                    <span className="locked">Floor 4</span>
                                </div>
                                <div className="floors">
                                    <span className="locked">Floor 3</span>
                                </div>
                                <div className="floors active">
                                    <span>Floor 2</span>
                                </div>
                                <div className="floors">
                                    <span>Floor 1</span>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>

                <section className="spelling-lower">
                    <section className="progress-container">
                        <h1>Progress:</h1>

                        <section className="section-list">
                            <span>Section 1</span>
                            <span>Section 2</span>
                            <span>Section 3</span>
                            <span>Section 4</span>
                            <span>Section 5</span>
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
}
