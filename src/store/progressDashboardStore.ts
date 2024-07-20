import { create } from "zustand";

interface ProgressDashboard {
    creditAmount: number;
    wordsCollected: number;
    achievementCount: number;
    floorCount: number;
}

interface ProgressDashboardState {
    progressDashboard: ProgressDashboard;
    setCreditAmount: (creditAmount: number) => void;
    setWordsCollected: (wordsCollected: number) => void;
    setAchievementCount: (achievementCount: number) => void;
    setFloorCount: (floorCount: number) => void;
}

const useProgressDashboardStore = create<ProgressDashboardState>((set) => ({
    progressDashboard: {
        creditAmount: 0,
        wordsCollected: 0,
        achievementCount: 0,
        floorCount: 0,
    },
    setCreditAmount: (creditAmount) =>
        set((state) => ({
            progressDashboard: { ...state.progressDashboard, creditAmount },
        })),
    setWordsCollected: (wordsCollected) =>
        set((state) => ({
            progressDashboard: { ...state.progressDashboard, wordsCollected },
        })),
    setAchievementCount: (achievementCount) =>
        set((state) => ({
            progressDashboard: { ...state.progressDashboard, achievementCount },
        })),
    setFloorCount: (floorCount) =>
        set((state) => ({
            progressDashboard: { ...state.progressDashboard, floorCount },
        })),
}));

export default useProgressDashboardStore;
