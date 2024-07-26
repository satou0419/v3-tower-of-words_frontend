import BASE_URL from "@/util/baseUrl";

const insertStudent = async (userID: number, room: any) => {

    try {
        const response = await fetch(
            `${BASE_URL}/room/${room.roomID}/insert_student/${userID}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to join room");
        }
        const data = await response.json();
        console.log("Join Room:", data);
        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export default insertStudent;
