import React from "react";
import "./cardachievement.scss";

interface Badges {
    achievementID: number;
    name: string;
    description: string;
    imagePath: string;
    totalUnlocked: number;
    criteria: number;
    achievementType: string;
}

interface CardAchievementProps {
    badge: Badges;
    equip: boolean;
    owned: boolean;
    onClick: () => void;
}

const CardAchievement: React.FC<CardAchievementProps> = ({
    badge,
    equip,
    owned,
    onClick,
}) => {
    if (owned === true) {
        console.log(badge);
    }
    return (
        <div
            className={`cardachievement-card ${owned ? "" : "gray-scale"}`}
            onClick={onClick}
        >
            <section className="cardachievement-container">
                {equip && <div className="equip-banner">Equipped</div>}
                <div className="banner-container">
                    <img
                        src={`/assets/images/badges/${badge.imagePath}_${
                            owned ? "unlocked" : "locked"
                        }.png`}
                        alt={badge.name}
                        className="badge-image"
                    />
                </div>

                <section className="cardachievement-cardinfo">
                    <div className="badge-name">{badge?.name}</div>
                    <div className="line-separate"></div>
                    <div className="badge-description">
                        {badge?.description}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default CardAchievement;
