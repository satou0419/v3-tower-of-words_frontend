import { create } from "zustand";

interface Item {
    itemID: number;
    itemName: string;
    imagePath: string;
    itemDescription: string;
    itemPrice: number;
    quantity: number; // Add quantity property
}

interface ItemState {
    items: Item[];
    setItems: (items: Item[]) => void;
}

export const useItemStore = create<ItemState>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
}));
