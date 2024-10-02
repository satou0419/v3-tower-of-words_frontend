import { create } from "zustand"

interface UserProgress {
    userProgressID: number
    spellingSectionProgress: number
    syllableSectionProgress: number
    silentSectionProgress: number
    spellingFloorID: number
    syllableFloorID: number
    silentFloorID: number

    silentFloorCount: number
    spellingFloorCount: number
    syllableFloorCount: number
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

    setSpellingFloorCount: (spellingFloorCount: number) => void
    setSyllableFloorCount: (syllableFloorCount: number) => void
    setSilentFloorCount: (silentFloorCount: number) => void
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
        silentFloorCount: 0,
        syllableFloorCount: 0,
        spellingFloorCount: 0,
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

    setSilentFloorCount: (silentFloorCount) =>
        set((state) => ({
            userProgress: { ...state.userProgress, silentFloorCount },
        })),

    setSpellingFloorCount: (spellingFloorCount) =>
        set((state) => ({
            userProgress: { ...state.userProgress, spellingFloorCount },
        })),

    setSyllableFloorCount: (syllableFloorCount) =>
        set((state) => ({
            userProgress: { ...state.userProgress, syllableFloorCount },
        })),
}))

export default useUserProgressStore
