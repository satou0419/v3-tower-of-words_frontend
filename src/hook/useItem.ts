import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useItem = () => {
    const { userID } = useAuthStore.getState();

    const useItemFunction = async (itemID: number) => {
        try {
            const response = await fetch(
                `${BASE_URL}/user_item/use_item/${userID}/${itemID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { useItemFunction };
};

export default useItem;
