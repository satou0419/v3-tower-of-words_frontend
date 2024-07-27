// src/hook/useBuyCharacter.ts
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useBuyCharacter = () => {
    const { userID } = useAuthStore.getState();
    const buyCharacter = async (characterID: number) => {
        const response = await fetch(
            `${BASE_URL}/user_character/buy_character_by/${userID}/${characterID}`,
            {
                method: "POST",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to purchase character");
        }

        const result = await response.json();
        return result;
    };

    return { buyCharacter };
};

export default useBuyCharacter;
