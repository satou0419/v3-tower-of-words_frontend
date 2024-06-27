import { create } from "zustand";

interface RegisterUserState {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmPassword: string;
    email: string;
    userType: string;

    setUsername: (username: string) => void;
    setFirstname: (firstname: string) => void;
    setLastname: (lastname: string) => void;
    setPassword: (password: string) => void;
    setCofirmPassword: (confirmPassword: string) => void;
    setEmail: (email: string) => void;
    setUserType: (email: string) => void;
}

const useRegisterStore = create<RegisterUserState>()((set) => ({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    email: "",
    userType: "",

    setUsername: (username) => set({ username }),
    setFirstname: (firstname) => set({ firstname }),
    setLastname: (lastname) => set({ lastname }),
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setCofirmPassword: (confirmPassword) => set({ confirmPassword }),
    setUserType: (userType) => set({ userType }),
}));
