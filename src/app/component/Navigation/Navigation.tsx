"use client";
import React, { useEffect, useRef, useState } from "react";
import "./navigation.css";
import { getGreeting } from "@/util/greetings";
import useUserInfoStore from "@/store/userInfoStore";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import Link from "next/link";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );
    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);
    const [showContent, setShowContent] = useState(false);
    const { firstname, lastname, setFirstname, setLastname } =
        useUserInfoStore();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleRef = useRef<HTMLDivElement>(null);
    const dropdownListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                toggleRef.current &&
                !toggleRef.current.contains(e.target as Node) &&
                dropdownListRef.current &&
                !dropdownListRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    useEffect(() => {
        const listElement = toggleRef.current?.nextElementSibling;
        const onTransitionEnd = () => {
            setShowContent(isOpen);
        };

        if (listElement) {
            listElement.addEventListener("transitionend", onTransitionEnd);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener(
                    "transitionend",
                    onTransitionEnd
                );
            }
        };
    }, [isOpen]);

    const greeting = getGreeting();

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        const userInfo = useUserInfoStore.getState();
        setFirstname(userInfo.firstname);
        setLastname(userInfo.lastname);
    }, [setFirstname, setLastname]);

    return (
        <nav className="navigation">
            <section>
                <span>Credits: {userDashboard.creditAmount}</span>
                <span>{greeting}</span>
                <span>{firstname}</span>
                <span>{lastname}</span>
            </section>

            <div className="navigation_logo">
                <img src="/assets/images/logo/logo_simple.webp" alt="Logo" />
            </div>

            <section className="drop-panel">
                <section className="drop-list">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                </section>
            </section>

            <section className="drop-user">
                <span>Username</span>
                <section className="drop-profile"></section>
            </section>
        </nav>
    );
};

export default Navigation;
