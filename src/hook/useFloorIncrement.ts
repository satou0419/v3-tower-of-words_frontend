import { useState } from "react";
import useUserInfoStore from "@/store/userInfoStore";
import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";

const useFloorIncrement = () => {
    const userDetailsID = useUserInfoStore((state) => state.userDetailsID);
    const { userID } = useAuthStore.getState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const incrementFloor = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/user_details/increment_floor?userDetailsID=${userID}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // Optionally update the store with the new floor data if needed
        } catch (error) {
            console.error("Failed to increment floor:", error);
            setError("Failed to increment floor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        incrementFloor,
        loading,
        error,
    };
};

export default useFloorIncrement;
