import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const changePassword = async (oldPassword: string, newPassword: string) => {
    const { userID } = useAuthStore.getState();

    if (!userID) {
        throw new Error("User is not logged in");
    }

    const url = `${BASE_URL}/user/change_password?userID=${userID}&oldPassword=${oldPassword}&newPassword=${newPassword}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to change password");
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

export default changePassword;
