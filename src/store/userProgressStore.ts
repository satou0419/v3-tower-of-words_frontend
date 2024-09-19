import { create } from "zustand"

interface UserProgress {
    userProgressID: number
    spellingSectionProgress: number
    syllableSectionProgress: number
    silentSectionProgress: number
    spellingFloorID: number
    syllableFloorID: number
    silentFloorID: number
}

interface UserProgressState {
    userProgress: UserProgress
    setUserProgressID: (userProgressID: number) => void
    setSpellingSectionProgress: (spellingSectionProgress: number) => void
    setSyllableSectionProgress: (syllableSectionProgress: number) => void
    setSilentSectionProgress: (silentSectionProgress: number) => void
    setSpellingFloorID: (spellingFloorID: number) => void
    setSyllableFloorID: (syllableFloorID: number) => void
    setSilentFloorID: (silentFloorID: number) => void
}

const useUserProgressStore = create<UserProgressState>((set) => ({
    userProgress: {
        userProgressID: 0,
        spellingSectionProgress: 0,
        syllableSectionProgress: 0,
        silentSectionProgress: 0,
        spellingFloorID: 0,
        syllableFloorID: 0,
        silentFloorID: 0,
    },
    setUserProgressID: (userProgressID) =>
        set((state) => ({
            userProgress: { ...state.userProgress, userProgressID },
        })),
    setSpellingSectionProgress: (spellingSectionProgress) =>
        set((state) => ({
            userProgress: { ...state.userProgress, spellingSectionProgress },
        })),
    setSyllableSectionProgress: (syllableSectionProgress) =>
        set((state) => ({
            userProgress: { ...state.userProgress, syllableSectionProgress },
        })),
    setSilentSectionProgress: (silentSectionProgress) =>
        set((state) => ({
            userProgress: { ...state.userProgress, silentSectionProgress },
        })),
    setSpellingFloorID: (spellingFloorID) =>
        set((state) => ({
            userProgress: { ...state.userProgress, spellingFloorID },
        })),
    setSyllableFloorID: (syllableFloorID) =>
        set((state) => ({
            userProgress: { ...state.userProgress, syllableFloorID },
        })),
    setSilentFloorID: (silentFloorID) =>
        set((state) => ({
            userProgress: { ...state.userProgress, silentFloorID },
        })),
}))

export default useUserProgressStore
