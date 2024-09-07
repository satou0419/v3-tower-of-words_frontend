// floorStore.ts

import BASE_URL from "@/util/baseUrl"
import { create } from "zustand"

interface Floor {
    towerFloorID: number
    towerSection: number
    sectionFloor: number
    gameType: number
}

interface FloorState {
    floors: Floor[]
    setFloors: (floors: Floor[]) => void
    getSpellingFloors: () => Promise<void>
    getSyllableFloors: () => Promise<void>
    getSilentFloors: () => Promise<void>
}

export const useFloorStore = create<FloorState>((set) => ({
    floors: [],
    setFloors: (floors) => set({ floors }),

    getSpellingFloors: async () => {
        try {
            const response = await fetch(`${BASE_URL}/floor/get_all_floors`)
            if (!response.ok) {
                throw new Error("Failed to fetch all floors")
            }
            const data = await response.json()
            const floors: Floor[] = data.data
            set({ floors })
        } catch (error) {
            console.error("Error fetching all floors:", error)
        }
    },

    getSyllableFloors: async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/syllable_floor/get_all_syllable_floors`
            )
            if (!response.ok) {
                throw new Error("Failed to fetch all floors")
            }
            const data = await response.json()
            const floors: Floor[] = data.data
            set({ floors })
        } catch (error) {
            console.error("Error fetching all floors:", error)
        }
    },

    getSilentFloors: async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/silent_floor/get_all_silent_floors`
            )
            if (!response.ok) {
                throw new Error("Failed to fetch all floors")
            }
            const data = await response.json()
            const floors: Floor[] = data.data
            set({ floors })
        } catch (error) {
            console.error("Error fetching all floors:", error)
        }
    },
}))
