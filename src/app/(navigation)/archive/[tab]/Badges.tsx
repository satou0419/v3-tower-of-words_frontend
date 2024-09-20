"use client";
import React, { useState, useEffect } from "react";
import Loading from "@/app/loading"; // Import the Loading component
import CardAchievement from "@/app/component/Card/CardAchievement/CardAchievement";
import useAchievementStore from "@/store/useAchievementStore";
import Modal from "@/app/component/Modal/Modal";
import { useAuthStore } from "@/store/authStore";

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
    const { userAchievements, fetchUserAchievements, fetchAllAchievements } = useAchievementStore();
    const { userID } = useAuthStore.getState();
  
    const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null); // To store selected badge
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [isEquipped, setIsEquipped] = useState(false); // For equipment confirmation

    useEffect(() => {
        fetchAllAchievements();
        fetchUserAchievements(userID);
    }, [fetchAllAchievements, fetchUserAchievements]);

    console.log(userAchievements)

    const handleBadgeClick = (achievement: Achievement) => {
        setSelectedBadge(achievement); // Set the selected badge
        setIsModalOpen(true); // Open the modal for confirmation
    };

    const handleConfirmEquip = () => {
        // Logic to equip the badge or perform an action
        setIsEquipped(true);
        setIsModalOpen(false); // Close the confirmation modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseEquippedModal = () => {
        setIsEquipped(false);
    };

    return (
        <section className="badges-container">
            {userAchievements
                .filter((userAchievement) => userAchievement.unlocked == false)
                .map((userAchievement) => {
                    const badge = userAchievement.achievementID

                    return (
                        <CardAchievement
                            key={userAchievement.archiveAchievementID}
                            equip={true}
                            Badge={badge}
                            onClick={() => handleBadgeClick(badge)}
                        />
                    );
                })}

        {/* Modal for confirming badge equip */}
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

        {/* Success modal for badge equipped */}
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
