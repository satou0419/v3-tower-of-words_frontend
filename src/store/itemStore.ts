import { create } from "zustand";

interface Item {
    itemID: number;
    itemName: string;
    imagePath: string;
    itemDescription: string;
    itemPrice: number;
}

interface ItemState {
    items: Item[]; // Array of items
    setItems: (items: Item[]) => void; // Setter function for items
}

export const useItemStore = create<ItemState>((set) => ({
    items: [], // Initial empty array
    setItems: (items) => set({ items }), // Setter function to update items array
}));
