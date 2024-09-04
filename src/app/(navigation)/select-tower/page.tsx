import CardTower from "@/app/component/Card/CardTower/CardTower"
import "./select-tower.scss"

export default function SelectTower() {
    return (
        <main className="select-tower-wrapper">
            <h1>SELECT TOWER </h1>

            <section className="select-tower-cards">
                <CardTower
                    progressValue={1}
                    modeTitle="Spelling"
                    link="/tower/spelling"
                    className="dashboard-card"
                />
                <CardTower
                    progressValue={1}
                    modeTitle="Syllable"
                    link="/tower/spelling"
                    className="dashboard-card"
                />
                <CardTower
                    progressValue={1}
                    modeTitle="Silent Letters"
                    link="/tower/spelling"
                    className="dashboard-card"
                />
            </section>
        </main>
    )
}
