import { useItemStore } from "@/store/itemStore";
import BASE_URL from "@/util/baseUrl";

const getAllItems = async () => {
    const setItems = useItemStore.getState().setItems; // Access setItems function from useItemStore

    try {
        const response = await fetch(`${BASE_URL}/item/get_all_items`);
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
        const data = await response.json();

        // Map fetched data to items array and update Zustand store
        const items = data.map((item: any) => ({
            itemID: item.itemId,
            itemName: item.item_name,
            imagePath: item.image_path,
            itemDescription: item.item_description,
            itemPrice: item.item_price,
        }));

        setItems(items); // Update Zustand store with fetched items

        return items; // Return the fetched items if needed
    } catch (error) {
        console.error("Error fetching items:", error);
        return []; // Return an empty array or handle the error as needed
    }
};

export default getAllItems;
