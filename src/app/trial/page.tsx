"use client";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import useUserInfoStore from "@/store/userInfoStore";
import { useEffect } from "react";

export default function Trial() {
    useEffect(() => {
        getUserInfo();
    }, []);
    const { username } = useUserInfoStore((state) => ({
        username: state.username,
    }));
    return <h1>Username: {username}</h1>;
}
