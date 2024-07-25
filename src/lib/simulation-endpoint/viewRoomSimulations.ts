import BASE_URL from "@/util/baseUrl";

const viewRoomSimulations = async (roomID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/simulation/room_simulations/${roomID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch simulations in room:" + roomID);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error("Failed to fetch simulations in room:" + roomID);
    }
};

export default viewRoomSimulations;
