import { useAuthStore } from "@/store/authStore"
import BASE_URL from "@/util/baseUrl"
import { useState } from "react"

const useAchievementChecker = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [achievementToast, setAchievementToast] = useState<{
        message: string
        imageUrl: string
    } | null>(null)

    const achievementChecker = async (type: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const { userID } = useAuthStore.getState() // Make sure to retrieve userID from the auth store
            const response = await fetch(
                `${BASE_URL}/archive_achievement/check_user_eligibility?userID=${userID}&achievementType=${type}`
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()
            console.log(`Achievement Checker for ${type}`, data)

            // Check if there are achievements and set the toast
            if (data.data.length > 0) {
                const achievement = data.data[0] // Get the first achievement
                setAchievementToast({
                    message: `Achievement Unlocked: ${achievement.name}`,
                    imageUrl: `/assets/images/badges/${achievement.imagePath}_unlocked.png`,
                })
            } else {
                setAchievementToast(null) // Clear toast if no achievement
            }
        } catch (error: any) {
            setError(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const closeToast = () => {
        setAchievementToast(null) // Clear the toast on close
    }

    return {
        achievementChecker,
        isLoading,
        error,
        achievementToast,
        closeToast,
    }
}

export default useAchievementChecker
