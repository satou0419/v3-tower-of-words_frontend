import BASE_URL from "@/util/baseUrl";
import { create } from "zustand";

interface Character {
    characterID: number;
    name: string;
    imagePath: string;
    description: string;
    price: number;
}

interface UserCharacter {
    userCharacterID: number;
    userID: number;
    characterID: number; // Changed to number
    owned: boolean;
}

interface StoreState {
    characters: Character[];
    userCharacters: UserCharacter[];
    fetchAllCharacters: () => Promise<void>;
    fetchUserCharacters: (userID: number) => Promise<void>;
    addUserCharacter: (character: UserCharacter) => void;
    removeUserCharacter: (characterID: number) => void;
}

const useCharacterStore = create<StoreState>((set) => ({
    characters: [],
    userCharacters: [],

    fetchAllCharacters: async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/character/get_all_characters`
            );
            const result = await response.json();
            if (result.status === "OK") {
                set({ characters: result.data });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching all characters:", error);
        }
    },

    fetchUserCharacters: async (userID: number) => {
        try {
            const response = await fetch(
                `${BASE_URL}/user_character/get_user_characters_by/${userID}`
            );
            const result = await response.json();
            if (result.status === "OK") {
                set({ userCharacters: result.data });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching user characters:", error);
        }
    },

    addUserCharacter: (character: UserCharacter) =>
        set((state) => ({
            userCharacters: [...state.userCharacters, character],
        })),

    removeUserCharacter: (characterID: number) =>
        set((state) => ({
            userCharacters: state.userCharacters.filter(
                (char) => char.userCharacterID !== characterID
            ),
        })),
}));

export default useCharacterStore;
