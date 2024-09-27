// src/stores/enemyStore.ts
import BASE_URL from "@/util/baseUrl"
import { create } from "zustand"

interface Enemy {
    adventureEnemyID: number
    towerFloorID: number
    imagePath: string
    words: string[]
}

interface EnemyState {
    enemies: Enemy[]
    fetchEnemies: (floorID: number) => Promise<void>
    fetchSyllableEnemies: (floorID: number) => Promise<void>
    fetchSilentEnemies: (floorID: number) => Promise<void>
}

export const useEnemyStore = create<EnemyState>((set) => ({
    enemies: [],
    fetchEnemies: async (floorID) => {
        try {
            const response = await fetch(
                `${BASE_URL}/adventure_enemy/get_enemy_by_floor_id?floor_id=${floorID}`
            )
            const data = await response.json()
            if (data.status === "OK") {
                set({ enemies: data.data })
            } else {
                console.error("Failed to fetch enemies:", data.message)
            }
        } catch (error) {
            console.error("Error fetching enemies:", error)
        }
    },

    fetchSyllableEnemies: async (floorID) => {
        try {
            const response = await fetch(
                `${BASE_URL}/adventure_syllable_enemy/get_syllable_enemies_by_floor_id?towerFloorID=${floorID}`
            )
            const data = await response.json()
            if (data.status === "OK") {
                set({ enemies: data.data })
            } else {
                console.error("Failed to fetch enemies:", data.message)
            }
        } catch (error) {
            console.error("Error fetching enemies:", error)
        }
    },

    fetchSilentEnemies: async (floorID) => {
        try {
            const response = await fetch(
                `${BASE_URL}/adventure_silent_enemy/get_silent_enemies_by_floor_id?towerFloorID=${floorID}`
            )
            const data = await response.json()
            if (data.status === "OK") {
                set({ enemies: data.data })
            } else {
                console.error("Failed to fetch enemies:", data.message)
            }
        } catch (error) {
            console.error("Error fetching enemies:", error)
        }
    },
}))
