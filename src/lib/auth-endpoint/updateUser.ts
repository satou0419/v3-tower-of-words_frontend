// updateUser.ts
import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";

const updateUser = async (firstname: string, lastname: string) => {
    const { userID } = useAuthStore.getState();

    const url = `${BASE_URL}/user/update_user?uid=${userID}`;

    const requestBody = {
        firstname: firstname,
        lastname: lastname,
    };

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        const data = await response.json();
        console.log("User updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export default updateUser;
