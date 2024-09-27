import CardTower from "@/app/component/Card/CardTower/CardTower"
import "./select-tower.scss"

export default function SelectTower() {
    return (
        <main className="select-tower-wrapper">
            <h1>SELECT TOWER</h1>

            <section className="select-tower-cards">
                <CardTower
                    progressValue={1}
                    modeTitle="Spelling"
                    link="/tower/spelling?gameType=Spelling"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/spelling-tower-banner.webp"
                />
                <CardTower
                    progressValue={1}
                    modeTitle="Syllable"
                    link="/tower/spelling?gameType=Syllables"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/syllable-tower-banner.webp"
                />
                <CardTower
                    progressValue={1}
                    modeTitle="Silent Letters"
                    link="/tower/spelling?gameType=Silent"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/silent-tower-banner.webp"
                />
            </section>
        </main>
    )
}
