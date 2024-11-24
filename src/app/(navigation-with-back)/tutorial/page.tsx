import Adventure from "./adventure-spelling/page"
import "./tutorial.scss"

export default function Tutorial() {
    return (
        <main id="tutorial-wrapper">
            <section id="tutorial-section">
                <section id="tutorial-side">
                    <span>Span</span>
                </section>

                <section id="tutorial-main">
                    <Adventure />
                </section>
            </section>
        </main>
    )
}
