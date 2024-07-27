// app/unauthorized/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Unauthorized: React.FC = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect");
        const isLoggedInParam = urlParams.get("isLoggedIn") === "true";

        if (!isLoggedInParam) {
            setMessage("You need to be logged in to enter here.");
        } else {
            setMessage("You don't have the authority to access this page.");
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown === 0) {
            if (!isLoggedInParam) {
                router.replace("/login");
            } else {
                router.replace("/dashboard");
            }
        }

        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div>
            <h1>Unauthorized Access</h1>
            <p>{message}</p>
            <p>Redirecting in {countdown} seconds...</p>
        </div>
    );
};

export default Unauthorized;
