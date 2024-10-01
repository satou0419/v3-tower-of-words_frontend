import { useAuthStore } from "@/store/authStore"
import BASE_URL from "@/util/baseUrl"
import { useState } from "react"

const useAchievementChecker = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { userID } = useAuthStore.getState()

    const achievementChecker = async (type: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${BASE_URL}/archive_achievement/check_user_eligibility?userID=${userID}&achievementType=${type}`
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()
            console.log(`Achievement Checker for ${type}`, data)
        } catch (error: any) {
            setError(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { achievementChecker, isLoading, error }
}

export default useAchievementChecker
