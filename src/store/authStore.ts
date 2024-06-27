import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUserState {
    userID: number;
    username: string;
    isLoggedIn: boolean;

    setUserID: (userID: number) => void;
    setUsername: (username: string) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthUserState>()(
    persist(
        (set) => ({
            userID: 0,
            username: "",
            isLoggedIn: false,

            setUserID: (userID) => set({ userID }),
            setUsername: (username) => set({ username }),
            setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
        }),
        {
            name: "auth-user",
        }
    )
);
