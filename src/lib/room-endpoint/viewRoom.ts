import BASE_URL from "@/util/baseUrl";

// viewRoom.ts
interface RoomData {
    name: string;
    creatorID: number;
    roomID: number;
    code: string;
    members: number[];
    simulations: any[];
}

export const viewRoom = async (roomID: number): Promise<RoomData> => {
    try {
        console.log(roomID)
        const response = await fetch(
            `${BASE_URL}/room/room_details_by_id/${roomID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch room details");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching room details:", error);
        throw error;
    }
};
