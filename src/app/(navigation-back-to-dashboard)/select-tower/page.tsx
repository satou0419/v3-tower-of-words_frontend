"use client"
import CardTower from "@/app/component/Card/CardTower/CardTower"
import "./select-tower.scss"
import useUserProgressStore from "@/store/userProgressStore"
import BackButton from "@/app/component/Button/Back/Back"

export default function SelectTower() {
    const userTower = useUserProgressStore((state) => state.userProgress)
    return (
        <main className="select-tower-wrapper">
            <h1>SELECT TOWER</h1>

            <section className="select-tower-cards">
                <CardTower
                    progressValue={userTower.spellingFloorCount}
                    modeTitle="Spelling"
                    link="/adventure-mode?gameType=Spelling"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/spelling-tower-banner.webp"
                />
                <CardTower
                    progressValue={userTower.syllableFloorCount}
                    modeTitle="Syllable"
                    link="/adventure-mode?gameType=Syllables"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/syllable-tower-banner.webp"
                />
                <CardTower
                    progressValue={userTower.silentFloorCount}
                    modeTitle="Silent Letters"
                    link="/adventure-mode?gameType=Silent"
                    className="dashboard-card"
                    bannerSrc="/assets/images/banner/silent-tower-banner.webp"
                />
            </section>
        </main>
    )
}
