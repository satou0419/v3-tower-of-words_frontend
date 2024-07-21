import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";
import useUserProgressStore from "@/store/userProgressStore";
import BASE_URL from "@/util/baseUrl";
import { useState } from "react";

const useUpdateProgress = () => {
    // Access userProgress from userProgressStore
    const userProgress = useUserProgressStore((state) => state.userProgress);
    // Access userDetailsID from userInfoStore
    const userDetailsID = useUserInfoStore((state) => state.userDetailsID);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const updateProgress = async (floorID: number, section: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/tower_progress/update_user_progress?user_prog_id=${userProgress.userProgressID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userDetailsID, // Directly use the variable instead of accessing it from userDetails
                        towerSectionProgress: section,
                        floorID: floorID,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            console.log("Progress updated successfully:", result);
            console.log("User Details ID:", userDetailsID); // Log the ID for debugging
        } catch (error) {
            console.error("Error updating progress:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { updateProgress, isLoading, error, data };
};

export default useUpdateProgress;
