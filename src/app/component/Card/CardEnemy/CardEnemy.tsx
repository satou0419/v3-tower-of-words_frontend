import "./cardenemy.scss";

export default function CardEnemy() {
    return (
        <section className="cardenemy-wrapper">
            <section className="cardenemy-card">
                <section className="cardenemy-banner">
                    <div></div>
                </section>

                <section className="cardenemy-details">
                    <div className="name">
                        <span>Name</span>
                        <h1>Enemy 1</h1>
                    </div>

                    <div className="total">
                        <span>Words held</span>
                        <p>3</p>
                    </div>
                </section>

                <section className="cardenemy-control">
                    <button>X</button>
                    <button>v</button>
                </section>
            </section>
        </section>
    );
}
