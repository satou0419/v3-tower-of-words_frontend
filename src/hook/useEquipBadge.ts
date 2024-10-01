import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useEquipBadge = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userID } = useAuthStore.getState();

    const equipBadge = async (achievementID: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/archive_achievement/equip_badge?userID=${userID}&achievementID=${achievementID}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to equip badge");
            }

            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { equipBadge, loading, error };
};

export default useEquipBadge;
