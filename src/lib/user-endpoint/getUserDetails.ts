import { useAuthStore } from "@/store/authStore";
import useUserProgressStore from "@/store/userProgressStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import BASE_URL from "@/util/baseUrl";

const getUserDetails = async () => {
    const { userID } = useAuthStore.getState();
    const { setUserProgressID, setTowerSectionProgress, setFloorIDProgress } =
        useUserProgressStore.getState();
    const {
        setCreditAmount,
        setWordsCollected,
        setAchievementCount,
        setFloorCount,
    } = useProgressDashboardStore.getState();
    const { setEquippedCharacter, setEquippedBadge } =
        useProgressEquippedStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/user_details/get_user_detail?user_id=${userID}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch userDetails");
        }

        const data = await response.json();

        // Log the data received from the API
        console.log("API Response:", data);

        // Extract userProgress from the response
        const userProgress = data.data.userProgress;

        // Update and log User Progress
        setUserProgressID(userProgress.userProgressID);
        console.log(
            "Updated userProgressID:",
            useUserProgressStore.getState().userProgress.userProgressID
        );

        setTowerSectionProgress(userProgress.towerSectionProgress);
        console.log(
            "Updated towerSectionProgress:",
            useUserProgressStore.getState().userProgress.towerSectionProgress
        );

        setFloorIDProgress(userProgress.floorID);
        console.log(
            "Updated floorIDProgress:",
            useUserProgressStore.getState().userProgress.floorIDProgress
        );

        // Update and log Progress Dashboard
        setCreditAmount(data.data.creditAmount);
        console.log(
            "Updated creditAmount:",
            useProgressDashboardStore.getState().progressDashboard.creditAmount
        );

        setWordsCollected(data.data.wordsCollected);
        console.log(
            "Updated wordsCollected:",
            useProgressDashboardStore.getState().progressDashboard
                .wordsCollected
        );

        setAchievementCount(data.data.achievementCount);
        console.log(
            "Updated achievementCount:",
            useProgressDashboardStore.getState().progressDashboard
                .achievementCount
        );

        setFloorCount(data.data.floorCount);
        console.log(
            "Updated floorCount:",
            useProgressDashboardStore.getState().progressDashboard.floorCount
        );

        // Update and log Progress Equipped
        setEquippedCharacter(data.data.equipped_character);
        console.log(
            "Updated equippedCharacter:",
            useProgressEquippedStore.getState().progressEquipped
                .equippedCharacter
        );

        setEquippedBadge(data.data.badge_display);
        console.log(
            "Updated equippedBadge:",
            useProgressEquippedStore.getState().progressEquipped.equippedBadge
        );

        console.log("User Details", data);
        return data;
    } catch (error) {
        console.log("Error fetching user details:", error);
    }
};

export default getUserDetails;
