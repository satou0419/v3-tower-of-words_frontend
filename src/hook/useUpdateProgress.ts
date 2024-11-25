import useUserInfoStore from "@/store/userInfoStore"
import useUserProgressStore from "@/store/userProgressStore"
import BASE_URL from "@/util/baseUrl"
import { useState } from "react"

const useUpdateProgress = () => {
    // Access userProgress from userProgressStore
    const userProgress = useUserProgressStore((state) => state.userProgress)
    // Access userDetailsID from userInfoStore
    const userDetailsID = useUserInfoStore((state) => state.userDetailsID)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>(null)

    const silentFloorID = useUserProgressStore(
        (state) => state.userProgress.silentFloorID
    )
    const syllableFloorID = useUserProgressStore(
        (state) => state.userProgress.syllableFloorID
    )

    const spellingFloorID = useUserProgressStore(
        (state) => state.userProgress.spellingFloorID
    )

    const silentSectionProgress = useUserProgressStore(
        (state) => state.userProgress.silentSectionProgress
    )

    const spellingSectionProgress = useUserProgressStore(
        (state) => state.userProgress.spellingSectionProgress
    )

    const syllableSectionProgress = useUserProgressStore(
        (state) => state.userProgress.syllableSectionProgress
    )

    const updateSpellingProgress = async (floorID: number, section: number) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${BASE_URL}/tower_progress/update_user_progress?userProgressID=${userProgress.userProgressID}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userDetailsID,
                        spellingSectionProgress: section,
                        syllableSectionProgress: syllableSectionProgress,
                        silentSectionProgress: silentSectionProgress,
                        spellingFloorID: floorID,
                        syllableFloorID: syllableFloorID,
                        silentFloorID: silentFloorID,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
            console.log("Progress updated successfully:", result)
            console.log("User Details ID:", userDetailsID) // Log the ID for debugging
        } catch (error) {
            console.error("Error updating progress:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateSilentProgress = async (floorID: number, section: number) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${BASE_URL}/tower_progress/update_user_progress?userProgressID=${userProgress.userProgressID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userDetailsID,
                        spellingSectionProgress: spellingSectionProgress,
                        syllableSectionProgress: syllableSectionProgress,
                        silentSectionProgress: section,
                        spellingFloorID: spellingFloorID,
                        syllableFloorID: syllableFloorID,
                        silentFloorID: floorID,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
            console.log("Progress updated successfully:", result)
            console.log("User Details ID:", userDetailsID) // Log the ID for debugging
        } catch (error) {
            console.error("Error updating progress:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateSyllableProgress = async (floorID: number, section: number) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${BASE_URL}/tower_progress/update_user_progress?userProgressID=${userProgress.userProgressID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userDetailsID,
                        spellingSectionProgress: spellingSectionProgress,
                        syllableSectionProgress: section,
                        silentSectionProgress: silentSectionProgress,
                        spellingFloorID: spellingFloorID,
                        syllableFloorID: floorID,
                        silentFloorID: silentFloorID,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
            console.log("Progress updated successfully:", result)
            console.log("User Details ID:", userDetailsID) // Log the ID for debugging
        } catch (error) {
            console.error("Error updating progress:", error)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        updateSpellingProgress,
        updateSilentProgress,
        updateSyllableProgress,
        isLoading,
        error,
        data,
    }
}

export default useUpdateProgress
