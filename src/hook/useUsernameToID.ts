import BASE_URL from "@/util/baseUrl";

const useUsernameToID = () => {
    const usernameToID = async (username: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/user/get_user_id/${username}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user ID");
            }

            const data = await response.json();
            console.log("User ID:", data.data); // Log the user ID
            return data.data; // Return the user ID directly
        } catch (error) {
            console.error("Error fetching user ID:", error); // Use console.error for error logging
            throw error; // Re-throw error after logging
        }
    };

    return { usernameToID };
};

export default useUsernameToID;
