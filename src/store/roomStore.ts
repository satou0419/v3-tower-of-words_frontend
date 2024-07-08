import { create } from "zustand";

interface Room {
    name: string;
    creatorID: number;
    roomID: number;
    code: string;
    isDeleted: boolean;
}

interface RoomState {
    rooms: Room[];
    setRoom: (room: Room[]) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    setRoom: (rooms) => set({ rooms }),
}));
