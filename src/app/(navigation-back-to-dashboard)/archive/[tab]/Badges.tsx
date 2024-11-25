"use client";
import React, { useState, useEffect } from "react";
import CardAchievement from "@/app/component/Card/CardAchievement/CardAchievement";
import useAchievementStore from "@/store/useAchievementStore";
import Modal from "@/app/component/Modal/Modal";
import { useAuthStore } from "@/store/authStore";
import useEquipBadge from "@/hook/useEquipBadge";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import equipped from "@/store/progressEquippedStore";

interface Achievement {
    achievementID: number;
    name: string;
    description: string;
    imagePath: string;
    totalUnlocked: number;
    criteria: number;
    achievementType: string;
}

const Badges = () => {
    const {
        achievements,
        userAchievements,
        fetchUserAchievements,
        fetchAllAchievements,
    } = useAchievementStore();
    const { userID } = useAuthStore.getState();

    const [selectedBadge, setSelectedBadge] = useState<Achievement>({
        achievementID: 0,
        name: "",
        description: "",
        imagePath: "",
        totalUnlocked: 0,
        criteria: 0,
        achievementType: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEquipped, setIsEquipped] = useState(false);
    const { setEquippedBadge } = useProgressEquippedStore();
    const { equipBadge } = useEquipBadge();

    const badges = equipped();

    const equip = badges.progressEquipped.equippedBadge;

    useEffect(() => {
        fetchAllAchievements();
        fetchUserAchievements(userID);
    }, [fetchAllAchievements, fetchUserAchievements]);

    console.log(userAchievements);

    const handleBadgeClick = (achievement: Achievement) => {
        if (selectedBadge.achievementID === achievement.achievementID) {
            setSelectedBadge({
                achievementID: 0,
                name: "",
                description: "",
                imagePath: "",
                totalUnlocked: 0,
                criteria: 0,
                achievementType: "",
            });
        } else {
            setSelectedBadge(achievement);
        }
        setSelectedBadge(achievement);
        setIsModalOpen(true);
    };

    const handleConfirmEquip = async () => {
        setIsEquipped(true);
        setIsModalOpen(false);
        try {
            const result = await equipBadge(selectedBadge?.achievementID);
            console.log("Character equipped successfully:", result);
            setEquippedBadge(selectedBadge.imagePath);
        } catch (error) {
            console.error("Error Equip character:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseEquippedModal = () => {
        setIsEquipped(false);
    };

    console.log("Achievements:", achievements);
    console.log("User Achievements:", userAchievements);

    return (
        <section className="badges-container">
            {achievements
                .sort((a, b) => {
                    // First, sort by achievementType
                    if (a.achievementType < b.achievementType) return -1;
                    if (a.achievementType > b.achievementType) return 1;

                    // If achievementType is the same, sort by criteria
                    return a.criteria - b.criteria;
                })
                .map((achievement) => {
                    const isOwned = userAchievements.some(
                        (userAchievement) =>
                            userAchievement.achievementID.achievementID ===
                                achievement.achievementID &&
                            userAchievement.unlocked === true
                    );

                    const unlockedDate = userAchievements.find(
                        (userAchievement) =>
                            userAchievement.achievementID.achievementID ===
                            achievement.achievementID
                    )?.unlockedDate;

                    // Render the achievement type header if it's the first achievement of this type
                    return (
                        <section
                            key={achievement.achievementID}
                            className="badges-sort"
                        >
                            {achievements.findIndex(
                                (a) =>
                                    a.achievementType ===
                                    achievement.achievementType
                            ) === achievements.indexOf(achievement) && (
                                <span className="badges-type">
                                    {achievement.achievementType}
                                </span>
                            )}
                            <CardAchievement
                                key={achievement.achievementID}
                                equip={equip === achievement.imagePath}
                                badge={achievement}
                                owned={isOwned}
                                date={unlockedDate}
                                onClick={() => handleBadgeClick(achievement)}
                            />
                        </section>
                    );
                })}
            {selectedBadge && (
                <Modal
                    className="confirmation-modal"
                    title="Confirm Equip"
                    details={`Do you want to equip ${selectedBadge.name}?`}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    buttons={[
                        <button key="cancel" onClick={handleCloseModal}>
                            Cancel
                        </button>,
                        <button key="confirm" onClick={handleConfirmEquip}>
                            Confirm
                        </button>,
                    ]}
                />
            )}
            <Modal
                className="success-modal"
                title="Badge Equipped"
                details={`You have successfully equipped ${selectedBadge?.name}.`}
                isOpen={isEquipped}
                onClose={handleCloseEquippedModal}
                buttons={[
                    <button key="close" onClick={handleCloseEquippedModal}>
                        Close
                    </button>,
                ]}
            />
        </section>
    );
};

export default Badges;
