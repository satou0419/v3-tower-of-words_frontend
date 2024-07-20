"use client";
import React, { useEffect, useRef, useState } from "react";
import "./navigation.css";
import { getGreeting } from "@/util/greetings";
import useUserInfoStore from "@/store/userInfoStore";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import Link from "next/link";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShrinking, setIsShrinking] = useState(false);
    const [showList, setShowList] = useState(false);
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );

    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    const { firstname, lastname, setFirstname, setLastname } =
        useUserInfoStore();
    const username = useUserInfoStore((state) => state.username);

    const getInitial = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : "";
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        setIsShrinking((prev) => !prev); // Toggle shrink/expand state
    };

    const handleOverlayClick = () => {
        if (isOpen) {
            setIsOpen(false);
            setIsShrinking(true); // Start shrinking animation
            setShowList(false);
        }
    };

    const toggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            // Clicks inside dropdown list should not close the dropdown
            if (
                toggleRef.current &&
                !toggleRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setIsShrinking(true); // Start shrinking animation
                setShowList(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            setIsShrinking(false); // Ensure it's expanding
            timer = setTimeout(() => {
                setShowList(true);
            }, 300); // Delay should match the expand animation duration
        } else {
            setShowList(false);
            setIsShrinking(true); // Start shrinking animation
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setShowList(false);
            }, 300); // Match this delay with the shrink animation duration
            return () => clearTimeout(timer);
        }
    }, [isShrinking]);

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        const userInfo = useUserInfoStore.getState();
        setFirstname(userInfo.firstname);
        setLastname(userInfo.lastname);
    }, [setFirstname, setLastname]);

    const greeting = getGreeting();

    return (
        <nav className={`navigation ${isOpen ? "expanded" : ""}`}>
            <section>
                <span>Credits: {userDashboard.creditAmount}</span>
                <span>{greeting}</span>
                <span>{firstname}</span>
                <span>{lastname}</span>
            </section>
            <div className="navigation_logo">
                <img src="/assets/images/logo/logo_simple.webp" alt="Logo" />
            </div>
            <section
                className={`drop-container ${
                    isShrinking ? "shrink" : "expand"
                }`}
                ref={toggleRef}
                onClick={toggleDropdown}
            >
                <section
                    className={`drop-profile ${
                        isShrinking ? "shrink" : "expand"
                    }`}
                    ref={toggleRef}
                    onClick={toggleDropdown}
                >
                    <span>{username}</span>
                </section>
                <div className="profile">{getInitial(username)}</div>
                {showList && (
                    <section
                        className="drop-list"
                        ref={toggleRef}
                        onClick={toggleDropdown}
                    >
                        <Link href="/item/inventory">Inventory</Link>
                        <Link href="/setting/personal-information">
                            Settings
                        </Link>
                        <Link href="#">Logout</Link>
                    </section>
                )}
            </section>
            {isOpen && <div className="overlay" onClick={handleOverlayClick} />}
        </nav>
    );
};

export default Navigation;
