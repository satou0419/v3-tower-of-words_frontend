"use client";
import { useEffect } from "react"; // Assuming you're using React
import { useAuthStore } from "@/store/authStore";
import { useItemStore } from "@/store/itemStore";
import useUserDetailsStore from "@/store/userDetailsStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import Link from "next/link";
import { InputBox } from "@/app/component/Input/Input";
import "./dashboard.scss";

export default function Dashboard() {
    const { items } = useItemStore(); // Get items state from useItemStore
    const { userID, username, isLoggedIn } = useAuthStore((state) => ({
        username: state.username,
        isLoggedIn: state.isLoggedIn,
        userID: state.userID,
    }));

    const { firstname, lastname, email, userType } = useUserDetailsStore(
        (state) => ({
            firstname: state.firstname,
            lastname: state.lastname,
            email: state.email,
            userType: state.userType,
        })
    );

    console.log("isLoggedIn in Dashboard:", isLoggedIn); // Debugging log

    return (
        <main>
            <form>
                <InputBox placeholder="Hello" className="sample" autoFocus />
                <button type="submit">ss</button>
            </form>

            <p>User ID: {userID}</p>
            <p>Username: {username}</p>
            <p>IsLoggedIn: {isLoggedIn ? "True" : "False"}</p>

            <p>Firstname: {firstname}</p>
            <p>Lastname: {lastname}</p>
            <p>Email: {email}</p>
            <p>User Type: {userType}</p>

            <Link href="/inventory">To Inventory</Link>
        </main>
    );
}
