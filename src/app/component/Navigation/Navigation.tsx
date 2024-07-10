"use client";
import React, { useEffect, useRef, useState } from "react";
import "./navigation.css";
import { getGreeting } from "@/util/greetings";
import useUserInfoStore from "@/store/userInfoStore";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import Link from "next/link";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
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
            <span>{greeting}</span>
            <span>{firstname}</span>
            <span>{lastname}</span>

            <section className={`navigation-dropdown ${isOpen ? "open" : ""}`}>
                <div
                    ref={toggleRef}
                    className="navigation-profile"
                    onClick={toggleDropdown}
                ></div>
                <div
                    ref={dropdownListRef}
                    className={`navigation-dropdown_list ${
                        isOpen ? "open" : ""
                    }`}
                >
                    {showContent && (
                        <div className="dropdown-list">
                            <Link href="#">Adventure</Link>
                            <Link href="#">Shop</Link>
                            <Link href="/setting/personal-information">
                                Setting
                            </Link>

                            <Link href="#">Logout</Link>
                            {/* Add more elements here */}
                        </div>
                    )}
                </div>
            </section>
            {isOpen && <div className="overlay" />}
            <div className="navigation_logo">
                <img src="/assets/images/logo/logo_simple.webp" alt="Logo" />
            </div>
        </nav>
    );
};

export default Navigation;
