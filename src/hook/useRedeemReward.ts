import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";
import { useState } from "react";

const useRedeemReward = () => {
    const { userID } = useAuthStore.getState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const redeemReward = async (floorID: number) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(
                `${BASE_URL}/adventure_reward/give_reward_to_user/${floorID}/${userID}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Reward redeemed successfully:", result);

            setSuccess(true);
        } catch (error) {
            console.error("Error redeeming reward:", error);
            setError("Failed to redeem reward. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { redeemReward, isLoading, error, success };
};

export default useRedeemReward;
