// src/stores/enemyStore.ts
import BASE_URL from "@/util/baseUrl";
import { create } from "zustand";

interface Enemy {
    adventureEnemyID: number;
    towerFloorID: number;
    imagePath: string;
    words: string[];
}

interface EnemyState {
    enemies: Enemy[];
    fetchEnemies: (floorID: number) => Promise<void>;
}

export const useEnemyStore = create<EnemyState>((set) => ({
    enemies: [],
    fetchEnemies: async (floorID) => {
        try {
            const response = await fetch(
                `${BASE_URL}/adventure_enemy/get_enemy_by_floor_id?floor_id=${floorID}`
            );
            const data = await response.json();
            if (data.status === "OK") {
                set({ enemies: data.data });
            } else {
                console.error("Failed to fetch enemies:", data.message);
            }
        } catch (error) {
            console.error("Error fetching enemies:", error);
        }
    },
}));
