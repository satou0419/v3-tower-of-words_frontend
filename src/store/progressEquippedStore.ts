import { create } from "zustand";

interface ProgressEquipped {
    equippedCharacter: string;
    equippedBadge: string;
}

interface ProgressEquippedState {
    progressEquipped: ProgressEquipped;
    setEquippedCharacter: (equippedCharacter: string) => void;
    setEquippedBadge: (equippedBadge: string) => void;
}

const useProgressEquippedStore = create<ProgressEquippedState>((set) => ({
    progressEquipped: {
        equippedCharacter: "",
        equippedBadge: "",
    },
    setEquippedCharacter: (equippedCharacter) =>
        set((state) => ({
            progressEquipped: { ...state.progressEquipped, equippedCharacter },
        })),
    setEquippedBadge: (equippedBadge) =>
        set((state) => ({
            progressEquipped: { ...state.progressEquipped, equippedBadge },
        })),
}));

export default useProgressEquippedStore;
