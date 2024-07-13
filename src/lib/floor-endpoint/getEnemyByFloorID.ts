import BASE_URL from "@/util/baseUrl";

// src/api/getEnemyByFloorID.ts
export const getEnemyByFloorID = async (floorID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/adventure_enemy/get_enemy_by_floor_id?floor_id=${floorID}`
        );
        const data = await response.json();
        if (data.status === "OK") {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching enemies:", error);
        throw error;
    }
};
