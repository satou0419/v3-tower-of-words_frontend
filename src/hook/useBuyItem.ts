import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useBuyItem = () => {
    const { userID } = useAuthStore.getState();
    const buyItem = async (itemID: number) => {
        try {
            const response = await fetch(
                `${BASE_URL}/user_item/buy_item_single/${userID}/${itemID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Item bought successfully:", data);
            return data;
        } catch (error) {
            console.error("Failed to buy item:", error);
            throw error;
        }
    };

    return { buyItem };
};

export default useBuyItem;
