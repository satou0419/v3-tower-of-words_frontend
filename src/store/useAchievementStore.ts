import BASE_URL from "@/util/baseUrl";
import { create } from "zustand";

interface Achievement {
    achievementID: number;
    name: string;
    description: string;
    imagePath: string;
    totalUnlocked: number;
    criteria: number;
    achievementType: string;
}

interface UserAchievement {
    achievementID: Achievement;
    archiveAchievementID: number;
    checked: boolean;
    unlocked: boolean;
    unlockedDate: string | null;
    userID: number;
}

interface StoreState {
    achievements: Achievement[];
    userAchievements: UserAchievement[];
    fetchAllAchievements: () => Promise<void>;
    fetchUserAchievements: (userID: number) => Promise<void>;
    addUserAchievement: (achievement: UserAchievement) => void;
    removeUserAchievement: (archiveAchievementID: number) => void;
}

const useAchievementStore = create<StoreState>((set) => ({
    achievements: [],
    userAchievements: [],

    fetchAllAchievements: async () => {
        try {
            const response = await fetch(`${BASE_URL}/achievement/get_all_achievement`);
            const result = await response.json();
            if (result.status === "OK") {
                set({ achievements: result.data });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching all achievements:", error);
        }
    },

    fetchUserAchievements: async (userID: number) => {
        try {
            const response = await fetch(`${BASE_URL}/archive_achievement/get_archive_achievements_by_user_id?userID=${userID}`);
            const result = await response.json();
            if (result.status === "OK") {
                set({ userAchievements: result.data });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching user achievements:", error);
        }
    },

    addUserAchievement: (achievement: UserAchievement) =>
        set((state) => ({
            userAchievements: [...state.userAchievements, achievement],
        })),

    removeUserAchievement: (archiveAchievementID: number) =>
        set((state) => ({
            userAchievements: state.userAchievements.filter(
                (ach) => ach.archiveAchievementID !== archiveAchievementID
            ),
        })),
}));

export default useAchievementStore;
