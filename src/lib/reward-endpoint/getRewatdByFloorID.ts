import { RewardData } from "@/store/rewardStore";
import BASE_URL from "@/util/baseUrl";

export const getRewardByFloorId = async (
    floorId: number
): Promise<RewardData | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/adventure_reward/get_reward_by_floor_id?floor_id=${floorId}`
        );
        if (response.ok) {
            const data = await response.json();
            return data.data; // Assuming data.data contains the reward data
        } else {
            console.error("Failed to fetch reward data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching reward data:", error);
        return null;
    }
};
