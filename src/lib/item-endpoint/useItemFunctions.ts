import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";
import { useItemStore } from "@/store/itemStore";

export const useItem = async (itemID: number) => {
    const { userID } = useAuthStore.getState();
    const items = useItemStore.getState().items;
    const setItems = useItemStore.getState().setItems;

    try {
        const response = await fetch(
            `${BASE_URL}/user_item/use_item/${userID}/${itemID}`,
            {
                method: "POST",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to use item");
        }

        // Update item quantity in the store
        const updatedItems = items
            .map((item) => {
                if (item.itemID === itemID) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            })
            .filter((item) => item.quantity > 0); // Remove items with 0 quantity

        setItems(updatedItems);

        switch (itemID) {
            case 1:
                console.log("Using Item 1: Heal 1 life");
                // Implement the functionality here
                break;
            case 2:
                console.log("Using Item 2: Heal 3 lives");
                // Implement the functionality here
                break;
            case 3:
                console.log("Using Item 3: Enable pronunciation");
                // Implement the functionality here
                break;
            default:
                console.log("Item not recognized");
        }
    } catch (error) {
        console.error("Error using item:", error);
    }
};
