"use client";

import React, { useEffect, useState } from "react";
import useCharacterStore from "@/store/characterStore";
import Modal from "@/app/component/Modal/Modal";
import CardCharacter from "@/app/component/Card/CardCharacter/CardCharacter";
import CardCharacterPreview from "@/app/component/Card/CardCharacterPreview/CardCharacterPreview";
import { useAuthStore } from "@/store/authStore";
import equipped from "@/store/progressEquippedStore";
import useAnimationKeyframes from "@/hook/useAnimationKeyframes";
import useImageParse from "@/hook/useImageParse";
import useEquipCharacter from "@/hook/useEquipCharacter";
import useProgressEquippedStore from "@/store/progressEquippedStore";

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
    const [isEquipConfirmationOpen, setIsEquipConfirmationOpen] =
        useState(false);
    const [isEquipped, setIsEquipped] = useState(false);
    const { userID } = useAuthStore.getState();
    const character = equipped();
    const { setEquippedCharacter } = useProgressEquippedStore();
    const { equipCharacter } = useEquipCharacter();
    const [isCharacterAttacking, setIsCharacterAttacking] =
        useState<boolean>(false);
    const characterDetails = useImageParse(selectedCharacter.imagePath);
    const characterAnimation = useAnimationKeyframes(
        isCharacterAttacking ? "attack" : "idle",
        characterDetails.name,
        characterDetails.idleFrame,
        characterDetails.attackFrame
    );

    const equip = character.progressEquipped.equippedCharacter;

    useEffect(() => {
        fetchAllCharacters();
        fetchUserCharacters(userID);
    }, [fetchAllCharacters, fetchUserCharacters]);

    console.log(userCharacters);

    const handleCharacterClick = (character: Character) => {
        if (selectedCharacter.characterID === character.characterID) {
            setSelectedCharacter({
                characterID: 0,
                name: "",
                imagePath: "",
                description: "",
                price: 0,
            });
        } else {
            setSelectedCharacter(character);
        }
        console.log(character);
    };

    const handleAttack = () => {
        setIsCharacterAttacking((prevState) => !prevState);
    };

    const handleEquip = async () => {
        setIsEquipConfirmationOpen(true);
        try {
            const result = await equipCharacter(selectedCharacter.characterID);
            console.log("Character equipped successfully:", result);
            setEquippedCharacter(selectedCharacter.imagePath);
        } catch (error) {
            console.error("Error purchasing character:", error);
        }
    };

    const handleConfirmEquip = () => {
        if (selectedCharacter) {
            setIsEquipped(true);
            setIsEquipConfirmationOpen(false);
        }
    };

    const handleCloseEquipConfirmation = () => {
        setIsEquipConfirmationOpen(false);
    };

    const handleCloseEquippedModal = () => {
        setIsEquipped(false);
    };

    const characterName = (imagePath: string) => {
        const match = imagePath.match(/&\w+_(\w+)-a\d+-i\d+/);
        return match ? match[1] : "unknown";
    };

    return (
        <section className="character-wrapper">
            <section className="character-container">
                {userCharacters
                    .filter((userCharacter) => userCharacter.owned)
                    .map((userCharacter) => {
                        const character = userCharacter.characterID;
                        const profile = characterName(character.imagePath);
                        if (!character) return null;

                        return (
                            <CardCharacter
                                key={character.characterID}
                                bannerClass={`/assets/images/sprite/profile-${profile}.png`}
                                directory="Inventory"
                                equip={equip === character.imagePath}
                                infoTitle={character.name}
                                onClick={() => handleCharacterClick(character)}
                            />
                        );
                    })}
            </section>
            <section className="selected-character-container">
                {selectedCharacter.characterID != 0 ? (
                    <CardCharacterPreview
                        bannerClass={`${selectedCharacter.imagePath}`}
                        equip={equip === selectedCharacter.imagePath}
                        animation={characterAnimation}
                        character={characterDetails}
                        onAttackClick={handleAttack}
                        onEquipClick={handleEquip}
                    />
                ) : (
                    <div className="placeholder-message">
                        Select a character
                    </div>
                )}
            </section>
            <Modal
                className="confirmation-modal"
                title="Confirm Equip"
                details={`Do you want to equip ${selectedCharacter?.name}?`}
                isOpen={isEquipConfirmationOpen}
                onClose={handleCloseEquipConfirmation}
                buttons={[
                    <button key="cancel" onClick={handleCloseEquipConfirmation}>
                        Cancel
                    </button>,
                    <button key="confirm" onClick={handleConfirmEquip}>
                        Confirm
                    </button>,
                ]}
            />
            <Modal
                className="success-modal"
                title="Character Equipped"
                details={`You have successfully equipped ${selectedCharacter?.name}.`}
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

export default CharactersTab;
