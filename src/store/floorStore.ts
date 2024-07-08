// floorStore.ts

import BASE_URL from "@/util/baseUrl";
import { create } from "zustand";

interface Floor {
    towerFloorID: number;
    towerSection: number;
    sectionFloor: number;
    gameType: number;
}

interface FloorState {
    floors: Floor[];
    setFloors: (floors: Floor[]) => void;
    getAllFloors: () => Promise<void>;
}

export const useFloorStore = create<FloorState>((set) => ({
    floors: [],
    setFloors: (floors) => set({ floors }),

    getAllFloors: async () => {
        try {
            const response = await fetch(`${BASE_URL}/floor/get_all_floors`);
            if (!response.ok) {
                throw new Error("Failed to fetch all floors");
            }
            const data = await response.json();
            const floors: Floor[] = data.data;
            set({ floors });
        } catch (error) {
            console.error("Error fetching all floors:", error);
        }
    },
}));
