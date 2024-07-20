import { create } from "zustand";

interface UserProgress {
    userProgressID: number;
    towerSectionProgress: number;
    floorIDProgress: number;
}

interface UserProgressState {
    userProgress: UserProgress;
    setUserProgressID: (userProgressID: number) => void;
    setTowerSectionProgress: (towerSectionProgress: number) => void;
    setFloorIDProgress: (floorIDProgress: number) => void;
}

const useUserProgressStore = create<UserProgressState>((set) => ({
    userProgress: {
        userProgressID: 0,
        towerSectionProgress: 0,
        floorIDProgress: 0,
    },
    setUserProgressID: (userProgressID) =>
        set((state) => ({
            userProgress: { ...state.userProgress, userProgressID },
        })),
    setTowerSectionProgress: (towerSectionProgress) =>
        set((state) => ({
            userProgress: { ...state.userProgress, towerSectionProgress },
        })),
    setFloorIDProgress: (floorIDProgress) =>
        set((state) => ({
            userProgress: { ...state.userProgress, floorIDProgress },
        })),
}));

export default useUserProgressStore;
