import { useAuthStore } from "@/store/authStore"
import BASE_URL from "@/util/baseUrl"
import { useState } from "react"

// Custom Hook to handle updating user credit

const { userID } = useAuthStore.getState()
const useRewardCredit = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean | null>(null)

    // Function to update user credit
    const awardCredit = async (creditAmount: number) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const url = `${BASE_URL}/user_details/update_user_credit/${userID}/${creditAmount}`

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to update credit")
            }

            console.log("Credited", response)
            setSuccess(true)
        } catch (error) {
            setError((error as Error).message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return { awardCredit, loading, error, success }
}

export default useRewardCredit
