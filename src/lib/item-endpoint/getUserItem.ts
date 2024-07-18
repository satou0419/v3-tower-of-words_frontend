import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";

const getUserItems = async () => {
    const { userID } = useAuthStore.getState();

    try {
        // Fetch user items
        const userResponse = await fetch(
            `${BASE_URL}/user_item/get_user_items_by/${userID}`
        );
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user items");
        }
        const { data: userItemsData } = await userResponse.json();

        // Filter items with quantity greater than zero
        const itemsWithQuantity = userItemsData.filter(
            (userItem: any) => userItem.quantity > 0
        );

        console.log("User items with quantity > 0: ", itemsWithQuantity);
        return itemsWithQuantity;
    } catch (error) {
        console.error("Error fetching user items:", error);
        return [];
    }
};

export default getUserItems;
