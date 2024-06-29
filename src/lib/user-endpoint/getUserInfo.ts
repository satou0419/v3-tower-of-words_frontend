import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";
import BASE_URL from "@/util/baseUrl";

const getUserInfo = async () => {
    const userID = useAuthStore.getState().userID;
    const {
        setUserDetailsID,
        setUsername,
        setFirstname,
        setLastname,
        setEmail,
        setUserType,
    } = useUserInfoStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/user/get_user_info/${userID}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const data = await response.json();

        setUserDetailsID(data.data.userDetailsID);
        setUsername(data.data.username);
        setFirstname(data.data.firstname);
        setLastname(data.data.lastname);
        setEmail(data.data.email);
        setUserType(data.data.userType);

        console.log("User info fetched and stored:", data);
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
};

export default getUserInfo;
