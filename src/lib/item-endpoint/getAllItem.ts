import { useItemStore } from "@/store/itemStore";
import BASE_URL from "@/util/baseUrl";
import getUserInfo from "../user-endpoint/getUserInfo";
import { useAuthStore } from "@/store/authStore";

const getAllItems = async () => {
    const setItems = useItemStore.getState().setItems;
    const { userID } = useAuthStore.getState();

    try {
        // Fetch all items
        const response = await fetch(`${BASE_URL}/item/get_all_items`);
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
        const { data: itemsData } = await response.json();

        // Fetch user items
        const userResponse = await fetch(
            `${BASE_URL}/user_item/get_user_items_by/${userID}`
        );
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user items");
        }
        const { data: userItemsData } = await userResponse.json();

        // Map user item quantities to item IDs
        const userItemsMap = new Map<number, number>();
        userItemsData.forEach((userItem: any) => {
            userItemsMap.set(userItem.itemID.itemID, userItem.quantity);
        });

        // Merge item data with user quantities
        const items = itemsData.map((item: any) => ({
            itemID: item.itemID,
            itemName: item.name,
            imagePath: item.imagePath,
            itemDescription: item.description,
            itemPrice: item.price,
            quantity: userItemsMap.get(item.itemID) || 0,
        }));

        // Update Zustand store
        getUserInfo();
        setItems(items);
        console.log("Items: ", items);
        return items;
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
};

export default getAllItems;
