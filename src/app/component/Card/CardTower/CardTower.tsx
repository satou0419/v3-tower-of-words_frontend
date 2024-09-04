import React from "react"
import "./cardtower.scss"

import Link from "next/link"

interface CardModeProps {
    className?: string
    bannerSrc?: string
    progressHeader?: string
    progressValue?: number
    modeTitle?: string
    link: string
}

const CardTower: React.FC<CardModeProps> = ({
    className,
    bannerSrc = "/assets/images/banner/banner-adventure_large.webp",
    progressValue = 1,
    modeTitle = "Adventure",
    link = "#",
}) => {
    return (
        <main className={`${className ? className : ""}`}>
            <section className="cardtower-container">
                <Link href={link} className="cardtower-card">
                    <img src="/assets/images/banner/banner-tower.png" />

                    <section className="cardtower-description">
                        <h1>Floor Completed</h1>
                        <span>{progressValue}</span>
                    </section>

                    <h1 className="title">{modeTitle}</h1>
                </Link>
            </section>
        </main>
    )
}

export default CardTower
