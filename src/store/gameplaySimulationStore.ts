import { create } from "zustand";

interface GameplaySimulationState {
    lives: number;
    isPronunciationUnlocked: boolean;
    addLives: (amount: number) => void;
    subtractLives: (amount: number) => void;
    setLives: (lives: number) => void;
}

export const useGameplaySimulationStore = create<GameplaySimulationState>(
    (set) => ({
        lives: 0, // Initial dummy value
        isPronunciationUnlocked: false,
        setLives: (lives) => set({ lives }),
        addLives: (amount) =>
            set((state) => ({
                lives: state.lives + amount,
            })),
        subtractLives: (amount) =>
            set((state) => ({
                lives: Math.max(state.lives - amount, 0), // Ensure lives do not go below 0
            })),
    })
);
