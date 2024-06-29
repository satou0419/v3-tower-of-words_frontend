// src/lib/auth-endpoint/loginUser.ts
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";
import getAllItems from "../item-endpoint/getAllItem";

const loginUser = async (username: string, password: string) => {
    const { setIsLoggedIn, setUserID, setUsername } = useAuthStore.getState();

    const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    getAllItems();
    setIsLoggedIn(data.data.isLoggedIn); // Update auth state
    setUserID(data.data.userId);
    setUsername(data.username);

    return data; // Assuming the server responds with JSON data containing authentication details
};

export default loginUser;
