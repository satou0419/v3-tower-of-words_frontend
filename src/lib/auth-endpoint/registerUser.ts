import BASE_URL from "@/util/baseUrl";

const registerUser = async (userData: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    userType: string;
    password: string;
}) => {
    try {
        const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export default registerUser;
