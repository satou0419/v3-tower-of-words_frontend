import { useState } from "react"
import BASE_URL from "@/util/baseUrl"
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore"

const useUpdateTutorialStatus = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const {
        userDetailsID,
        setFirstGamePlayground,
        setFirstGameSilentSimu,
        setFirstGameSilentAdventure,
        setFirstGameSpellingAdventure,
        setFirstGameSyllableSimu,
        setFirstGameSyllableAdventure,
        setFirstGameSpellingSimu,
    } = useUserGameTutorialStatusStore((state) => ({
        userDetailsID: state.tutorialStatus.userDetailsID,
        setFirstGamePlayground: state.setFirstGamePlayground,
        setFirstGameSilentSimu: state.setFirstGameSilentSimu,
        setFirstGameSilentAdventure: state.setFirstGameSilentAdventure,
        setFirstGameSpellingAdventure: state.setFirstGameSpellingAdventure,
        setFirstGameSyllableSimu: state.setFirstGameSyllableSimu,
        setFirstGameSyllableAdventure: state.setFirstGameSyllableAdventure,
        setFirstGameSpellingSimu: state.setFirstGameSpellingSimu,
    }))

    const updateTutorialStatus = async (tutorialType: string) => {
        if (!userDetailsID) {
            setError("User details ID is required.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Make the API call to update tutorial status using PATCH
            const response = await fetch(
                `${BASE_URL}/user_game_tutorial_status/update_user_game_tutorial_status_by/${userDetailsID}/by_tutorial_type/${tutorialType}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            if (!response.ok) {
                throw new Error("Failed to update tutorial status")
            }

            // Update the Zustand store based on the tutorial type
            switch (tutorialType) {
                case "playground":
                    setFirstGamePlayground(true)
                    break
                case "silentadventure":
                    setFirstGameSilentAdventure(true)
                    break
                case "spellingadventure":
                    setFirstGameSpellingAdventure(true)
                    break
                case "syllableadventure":
                    setFirstGameSyllableAdventure(true)
                    break
                case "syllablesimu":
                    setFirstGameSyllableSimu(true)
                    break
                case "silentsimu":
                    setFirstGameSilentSimu(true)
                    break
                case "spellingsimu":
                    setFirstGameSpellingSimu(true)
                    break
                default:
                    throw new Error("Invalid tutorial type")
            }
        } catch (err: any) {
            setError(`Failed to update status: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return { updateTutorialStatus, loading, error }
}

export default useUpdateTutorialStatus
