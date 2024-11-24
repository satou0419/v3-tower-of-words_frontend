import { create } from "zustand"

// Define the type for the tutorial status
interface UserGameTutorialStatus {
    userGameTutorialStatusID: number
    userDetailsID: number
    firstGamePlayground: boolean
    firstGameSilentSimu: boolean
    firstGameSilentAdventure: boolean
    firstGameSpellingAdventure: boolean
    firstGameSyllableSimu: boolean
    firstGameSyllableAdventure: boolean
    firstGameSpellingSimu: boolean
}

// Define the state interface for the store
interface UserGameTutorialStatusState {
    tutorialStatus: UserGameTutorialStatus
    setUserGameTutorialStatusID: (userGameTutorialStatusID: number) => void
    setUserDetailsID: (userDetailsID: number) => void
    setFirstGamePlayground: (firstGamePlayground: boolean) => void
    setFirstGameSilentSimu: (firstGameSilentSimu: boolean) => void
    setFirstGameSilentAdventure: (firstGameSilentAdventure: boolean) => void
    setFirstGameSpellingAdventure: (firstGameSpellingAdventure: boolean) => void
    setFirstGameSyllableSimu: (firstGameSyllableSimu: boolean) => void
    setFirstGameSyllableAdventure: (firstGameSyllableAdventure: boolean) => void
    setFirstGameSpellingSimu: (firstGameSpellingSimu: boolean) => void
}

// Create the Zustand store
const useUserGameTutorialStatusStore = create<UserGameTutorialStatusState>(
    (set) => ({
        tutorialStatus: {
            userGameTutorialStatusID: 0,
            userDetailsID: 0,
            firstGamePlayground: false,
            firstGameSilentSimu: false,
            firstGameSilentAdventure: false,
            firstGameSpellingAdventure: false,
            firstGameSyllableSimu: false,
            firstGameSyllableAdventure: false,
            firstGameSpellingSimu: false,
        },
        setUserGameTutorialStatusID: (userGameTutorialStatusID) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    userGameTutorialStatusID,
                },
            })),
        setUserDetailsID: (userDetailsID) =>
            set((state) => ({
                tutorialStatus: { ...state.tutorialStatus, userDetailsID },
            })),
        setFirstGamePlayground: (firstGamePlayground) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGamePlayground,
                },
            })),
        setFirstGameSilentSimu: (firstGameSilentSimu) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSilentSimu,
                },
            })),
        setFirstGameSilentAdventure: (firstGameSilentAdventure) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSilentAdventure,
                },
            })),
        setFirstGameSpellingAdventure: (firstGameSpellingAdventure) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSpellingAdventure,
                },
            })),
        setFirstGameSyllableSimu: (firstGameSyllableSimu) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSyllableSimu,
                },
            })),
        setFirstGameSyllableAdventure: (firstGameSyllableAdventure) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSyllableAdventure,
                },
            })),
        setFirstGameSpellingSimu: (firstGameSpellingSimu) =>
            set((state) => ({
                tutorialStatus: {
                    ...state.tutorialStatus,
                    firstGameSpellingSimu,
                },
            })),
    })
)

export default useUserGameTutorialStatusStore
