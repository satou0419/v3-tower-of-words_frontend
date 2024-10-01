import { useAuthStore } from "@/store/authStore";
import useUserProgressStore from "@/store/userProgressStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import BASE_URL from "@/util/baseUrl";

const getUserDetails = async () => {
    const { userID } = useAuthStore.getState();
    const {
        setUserProgressID,
        setSilentFloorID,
        setSpellingFloorID,
        setSyllableFloorID,
        setSyllableSectionProgress,
        setSilentSectionProgress,
        setSpellingSectionProgress,
    } = useUserProgressStore.getState();
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
            `${BASE_URL}/user_details/get_user_detail?userID=${userID}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch userDetails");
        }

        const data = await response.json();

        // Extract userProgress from the response
        const userProgress = data.data.userProgress;

        // Update and log User Progress
        setUserProgressID(userProgress.userProgressID);
        setSpellingSectionProgress(userProgress.spellingSectionProgress);
        setSyllableSectionProgress(userProgress.syllableSectionProgress);
        setSilentSectionProgress(userProgress.silentSectionProgress);
        setSpellingFloorID(userProgress.spellingFloorID);
        setSyllableFloorID(userProgress.syllableFloorID);
        setSilentFloorID(userProgress.silentFloorID);

        // Update and log Progress Dashboard
        setCreditAmount(data.data.creditAmount);
        setWordsCollected(data.data.wordsCollected);
        setAchievementCount(data.data.achievementCount);
        setFloorCount(data.data.floorCount);

        // Update and log Progress Equipped
        setEquippedCharacter(data.data.equipped_character);

        setEquippedBadge(data.data.badge_display);

        return data;
    } catch (error) {
        console.log("Error fetching user details:", error);
    }
};

export default getUserDetails;
