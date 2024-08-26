import BASE_URL from "@/util/baseUrl"

const registerUser = async (
    userData: {
        username: string
        email: string
        firstname: string
        lastname: string
        userType: string
        password: string
    },
    options: { signal?: AbortSignal } = {}
) => {
    try {
        const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            signal: options.signal, // Pass the signal to the fetch request
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                console.log("Request was aborted")
            } else {
                console.error("Error registering user:", error.message)
            }
        } else {
            console.error("An unknown error occurred:", error)
        }
        throw error // Re-throw the error after logging it
    }
}

export default registerUser
