// useTutorialStore.ts
import { create } from "zustand"

interface TutorialStore {
    onFinish: () => void
    setOnFinish: (callback: () => void) => void
}

export const useTutorialStore = create<TutorialStore>((set) => ({
    onFinish: () => {}, // Default empty function
    setOnFinish: (callback) =>
        set((state) => {
            // Only set if the callback is different
            if (state.onFinish !== callback) {
                return { onFinish: callback }
            }
            return state
        }),
}))
