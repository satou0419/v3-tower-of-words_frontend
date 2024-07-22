import { create } from "zustand";

interface GameplayState {
    lives: number;
    addLives: (amount: number) => void;
    subtractLives: (amount: number) => void;
}

export const useGameplayStore = create<GameplayState>((set) => ({
    lives: 5,
    isPronunciationUnlocked: false,
    addLives: (amount) =>
        set((state) => ({
            lives: Math.min(state.lives + amount, 5), // Ensure lives do not exceed 5
        })),
    subtractLives: (amount) =>
        set((state) => ({ lives: state.lives - amount })),
}));
