import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";

// Define types directly in the same file
interface Item {
    itemID: number;
    name: string;
    imagePath: string;
    description: string;
    price: number;
}

interface UserItem {
    userItemID: number;
    quantity: number;
    userID: number;
    itemID: Item;
}

interface UserItemsResponse {
    data: UserItem[];
    message: string;
    status: string;
}

const getUserItems = async (): Promise<UserItem[]> => {
    const { userID } = useAuthStore.getState();

    try {
        // Fetch user items
        const userResponse = await fetch(
            `${BASE_URL}/user_item/get_user_items_by/${userID}`
        );
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user items");
        }
        const userItemsData: UserItemsResponse = await userResponse.json();

        // Filter items with quantity greater than zero
        const itemsWithQuantity = userItemsData.data.filter(
            (userItem) => userItem.quantity > 0
        );

        console.log("User items with quantity > 0: ", itemsWithQuantity);
        return itemsWithQuantity;
    } catch (error) {
        console.error("Error fetching user items:", error);
        return [];
    }
};

export default getUserItems;
