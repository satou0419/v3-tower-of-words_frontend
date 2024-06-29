import { create } from "zustand";

interface UserInfoState {
    userDetailsID: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    userType: string;

    setUserDetailsID: (userDetailsID: number) => void;
    setUsername: (username: string) => void;
    setFirstname: (firstname: string) => void;
    setLastname: (lastname: string) => void;
    setEmail: (email: string) => void;
    setUserType: (userType: string) => void;
}
const useUserInfoStore = create<UserInfoState>()((set) => ({
    userDetailsID: 0,
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    userType: "",

    setUserDetailsID: (userDetailsID) => set({ userDetailsID }),
    setUsername: (username) => set({ username }),
    setFirstname: (firstname) => set({ firstname }),
    setLastname: (lastname) => set({ lastname }),
    setEmail: (email) => set({ email }),
    setUserType: (userType) => set({ userType }),
}));

export default useUserInfoStore;
