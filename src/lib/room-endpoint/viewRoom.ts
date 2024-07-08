import BASE_URL from "@/util/baseUrl";

// viewRoom.ts
interface RoomData {
    roomID: number;
    code: string;
    isDeleted: boolean;
}

export const viewRoom = async (roomID: number): Promise<RoomData> => {
    try {
        const response = await fetch(
            `${BASE_URL}/room/view_room_by_id/${roomID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch room details");
        }
        const data: RoomData = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching room details:", error);
        throw error;
    }
};
