"use client";
import React, { useEffect, useState } from "react";
import useCharacterStore from "@/store/characterStore";
import Modal from "@/app/component/Modal/Modal";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import CardCharacter from "@/app/component/Card/CardCharacter/CardCharacter";
import CardCharacterPreview from "@/app/component/Card/CardCharacterPreview/CardCharacterPreview";
import useAnimationKeyframes from "@/hook/useAnimationKeyframes";
import useImageParse from "@/hook/useImageParse";
import { useAuthStore } from "@/store/authStore";
import equipped from "@/store/progressEquippedStore";
import useBuyCharacter from "@/lib/character-endpoint/buyCharacter";

interface Character {
    characterID: number;
    name: string;
    imagePath: string;
    description: string;
    price: number;
}

const CharactersTab: React.FC = () => {
    const {
        characters,
        userCharacters,
        fetchUserCharacters,
        fetchAllCharacters,
    } = useCharacterStore();
    const [selectedCharacter, setSelectedCharacter] = useState<Character>({
        characterID: 0,
        name: "",
        imagePath: "",
        description: "",
        price: 0,
    });
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isInsufficientBalanceOpen, setIsInsufficientBalanceOpen] =
        useState(false);
    const [purchasedCharacterName, setPurchasedCharacterName] = useState<
        string | null
    >(null);
    const { userID } = useAuthStore.getState();
    const { progressDashboard, setCreditAmount } = useProgressDashboardStore();
    const [isCharacterAttacking, setIsCharacterAttacking] =
        useState<boolean>(false);
    const characterDetails = useImageParse(selectedCharacter.imagePath);
    const { buyCharacter } = useBuyCharacter();
    const characterAnimation = useAnimationKeyframes(
        isCharacterAttacking ? "attack" : "idle",
        characterDetails.name,
        characterDetails.idleFrame,
        characterDetails.attackFrame
    );
    const [isBuyButtonClicked, setIsBuyButtonClicked] = useState(false);

    useEffect(() => {
        fetchAllCharacters();
        fetchUserCharacters(userID);
    }, [fetchAllCharacters, fetchUserCharacters]);

    const handleCharacterClick = (character: Character) => {
        if (selectedCharacter.characterID === character.characterID) {
            if (!isBuyButtonClicked && !selectedCharacter) {
                setSelectedCharacter({
                    characterID: 0,
                    name: "",
                    imagePath: "",
                    description: "",
                    price: 0,
                });
            }
        } else {
            setSelectedCharacter(character);
        }
        setIsBuyButtonClicked(false);
    };

    const handleAttack = () => {
        setIsCharacterAttacking((prevState) => !prevState);
        console.log("clicked");
    };

    const handleBuyClick = (character: Character) => {
        // Set the buy button clicked state
        setIsBuyButtonClicked(true);
        setSelectedCharacter(character); // Always set the selected character
        setIsConfirmationOpen(true); // Open the confirmation modal
    };

    const handleConfirmPurchase = async () => {
        if (selectedCharacter) {
            if (progressDashboard.creditAmount < selectedCharacter.price) {
                setIsInsufficientBalanceOpen(true);
                setIsConfirmationOpen(false);
                return;
            }
            console.log("Purchase successful");

            try {
                const result = await buyCharacter(
                    selectedCharacter.characterID
                );
                setCreditAmount(
                    progressDashboard.creditAmount - selectedCharacter.price
                );
                console.log("Character purchased successfully:", result);
            } catch (error) {
                console.error("Error purchasing character:", error);
            }

            setIsConfirmationOpen(false);
            setSelectedCharacter({
                characterID: 0,
                name: "",
                imagePath: "",
                description: "",
                price: 0,
            });
        }
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
        setSelectedCharacter({
            characterID: 0,
            name: "",
            imagePath: "",
            description: "",
            price: 0,
        });
    };

    const handleCloseSuccess = () => {
        setIsSuccessOpen(false);
        setPurchasedCharacterName(null);
    };

    const handleCloseInsufficientBalance = () => {
        setIsInsufficientBalanceOpen(false);
    };

    const characterName = (imagePath: string) => {
        const match = imagePath.match(/&\w+_(\w+)-a\d+-i\d+/);
        return match ? match[1] : "unknown";
    };

    return (
        <section className="character-wrapper">
            <section className="character-container">
                {characters.map((character) => {
                    const profile = characterName(character.imagePath);
                    const isOwned = userCharacters.some(
                        (userCharacter) =>
                            userCharacter.characterID.characterID ===
                                character.characterID &&
                            userCharacter.owned === true
                    );
                    if (!character) return null;

                    return (
                        <CardCharacter
                            key={character.characterID}
                            bannerClass={`/assets/images/sprite/profile-${profile}.png`}
                            directory="Shop"
                            owned={isOwned}
                            infoTitle={character.name}
                            price={character.price}
                            onClick={() => handleCharacterClick(character)}
                            onBuyClick={() => handleBuyClick(character)}
                        />
                    );
                })}
            </section>
            <section className="selected-character-container">
                {selectedCharacter.characterID != 0 ? (
                    <CardCharacterPreview
                        bannerClass={`${selectedCharacter.imagePath}`}
                        animation={characterAnimation}
                        character={characterDetails}
                        onAttackClick={handleAttack}
                    />
                ) : (
                    <div className="placeholder-message">
                        Select a character
                    </div>
                )}
            </section>
            <Modal
                className="confirmation-modal"
                title="Confirm Purchase"
                details={`Do you want to purchase ${selectedCharacter?.name} for ${selectedCharacter?.price} credits?`}
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                buttons={[
                    <button key="cancel" onClick={handleCloseConfirmation}>
                        Cancel
                    </button>,
                    <button key="confirm" onClick={handleConfirmPurchase}>
                        Confirm
                    </button>,
                ]}
            />
            <Modal
                className="confirm-modal"
                title="Purchase Successful"
                details={`You have successfully purchased ${purchasedCharacterName}!`}
                isOpen={isSuccessOpen}
                onClose={handleCloseSuccess}
                buttons={[
                    <button key="ok" onClick={handleCloseSuccess}>
                        Confirm
                    </button>,
                ]}
            />
            <Modal
                className="error-modal"
                title="Insufficient Balance"
                details={`You do not have enough credits to purchase ${selectedCharacter?.name}.`}
                isOpen={isInsufficientBalanceOpen}
                onClose={handleCloseInsufficientBalance}
                buttons={[
                    <button key="ok" onClick={handleCloseInsufficientBalance}>
                        Continue
                    </button>,
                ]}
            />
        </section>
    );
};

export default CharactersTab;
