import React from "react";
import "./cardachievement.scss";

interface Badges {
    achievementID?: number;
    name: string;
    description: string;
    imagePath: string;
    totalUnlocked: number;
    criteria: number;
    achievementType: string;
}

interface CardAchievementProps {
    Badge: Badges;
    equip: boolean;
    onClick: () => void;
}

const CardAchievement: React.FC<CardAchievementProps> = ({ Badge, equip, onClick }) => {
    return (
        <div className="cardachievement-card" onClick={onClick}>
            <section className="cardachievement-container">
                <div className="banner-container">
                    <img src={Badge.imagePath} alt={Badge.name} className="badge-image" />
                </div>
                
                <section className="cardachievement-cardinfo">
                    <div className="badge-name">
                        {Badge?.name}
                    </div>
                    <div className="line-separate"></div>
                    <div className="badge-description">
                        {Badge?.description}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default CardAchievement;
