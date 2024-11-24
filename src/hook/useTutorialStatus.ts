import { useState, useEffect } from "react"
import BASE_URL from "@/util/baseUrl"
import useUserInfoStore from "@/store/userInfoStore"
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore"

const useTutorialStatus = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const userDetailsID = useUserInfoStore((state) => state.userDetailsID)
    const setUserGameTutorialStatusID = useUserGameTutorialStatusStore(
        (state) => state.setUserGameTutorialStatusID
    )
    const setUserDetailsID = useUserGameTutorialStatusStore(
        (state) => state.setUserDetailsID
    )
    const setFirstGamePlayground = useUserGameTutorialStatusStore(
        (state) => state.setFirstGamePlayground
    )
    const setFirstGameSilentSimu = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSilentSimu
    )
    const setFirstGameSilentAdventure = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSilentAdventure
    )
    const setFirstGameSpellingAdventure = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSpellingAdventure
    )
    const setFirstGameSyllableSimu = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSyllableSimu
    )
    const setFirstGameSyllableAdventure = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSyllableAdventure
    )
    const setFirstGameSpellingSimu = useUserGameTutorialStatusStore(
        (state) => state.setFirstGameSpellingSimu
    )

    useEffect(() => {
        const fetchUserTutorialStatus = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/user_game_tutorial_status/get_user_game_tutorial_status_by_user_details_id?userDetailsID=${userDetailsID}`
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch user details")
                }

                const data = await response.json()
                console.log("data", data)

                // Update Zustand store with the fetched data
                const tutorialStatus = data.data
                setUserGameTutorialStatusID(
                    tutorialStatus.userGameTutorialStatusID
                )
                setUserDetailsID(tutorialStatus.userDetailsID)
                setFirstGamePlayground(tutorialStatus.firstGamePlayground)
                setFirstGameSilentSimu(tutorialStatus.firstGameSilentSimu)
                setFirstGameSilentAdventure(
                    tutorialStatus.firstGameSilentAdventure
                )
                setFirstGameSpellingAdventure(
                    tutorialStatus.firstGameSpellingAdventure
                )
                setFirstGameSyllableSimu(tutorialStatus.firstGameSyllableSimu)
                setFirstGameSyllableAdventure(
                    tutorialStatus.firstGameSyllableAdventure
                )
                setFirstGameSpellingSimu(tutorialStatus.firstGameSpellingSimu)
            } catch (err: any) {
                setError(`Failed to get details: ${err.message}`)
            } finally {
                setLoading(false) // Ensure loading is set to false after completion
            }
        }

        if (userDetailsID) {
            fetchUserTutorialStatus()
        }
    }, [
        userDetailsID,
        setUserGameTutorialStatusID,
        setUserDetailsID,
        setFirstGamePlayground,
        setFirstGameSilentSimu,
        setFirstGameSilentAdventure,
        setFirstGameSpellingAdventure,
        setFirstGameSyllableSimu,
        setFirstGameSyllableAdventure,
        setFirstGameSpellingSimu,
    ])

    return { error, loading }
}

export default useTutorialStatus
