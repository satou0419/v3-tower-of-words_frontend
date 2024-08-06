import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useEquipCharacter = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userID } = useAuthStore.getState();

    const equipCharacter = async (characterID: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/user_character/equip_character_by/${userID}/${characterID}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to equip character");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { equipCharacter, loading, error };
};

export default useEquipCharacter;
