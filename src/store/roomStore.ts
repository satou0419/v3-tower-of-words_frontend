import { create } from "zustand";

interface Room {
    name: string;
    creatorID: number;
    roomID: number;
    code: string;
    members: number[];
    simulations: any[];
}

interface RoomState {
    rooms: Room[];
    currentRoom: Room;
    setRoom: (rooms: Room[]) => void;
    setCurrentRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    currentRoom: {
        name: "",
        creatorID: 0,
        roomID: 0,
        code: "",
        members: [],
        simulations: []
    },
    setRoom: (rooms) => set({ rooms }),
    setCurrentRoom: (room) => set({ currentRoom: room }),
}));
