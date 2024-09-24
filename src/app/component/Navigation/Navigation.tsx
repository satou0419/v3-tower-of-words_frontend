"use client";
import React, { useEffect, useRef, useState } from "react";
import "./navigation.css";
import { useRouter } from "next/navigation";
import { getGreeting } from "@/util/greetings";
import useUserInfoStore from "@/store/userInfoStore";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import Link from "next/link";
import Modal from "@/app/component/Modal/Modal"; // Adjust import as needed

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShrinking, setIsShrinking] = useState(false);
    const [showList, setShowList] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state for logout modal
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );
    const router = useRouter();

    const toDashboard = () => {
        router.push("/dashboard");
    };

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

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true); // Open the logout confirmation modal
    };

    const confirmLogout = () => {
        localStorage.removeItem("auth-user");
        router.push("/login");
    };

    const cancelLogout = () => {
        setIsLogoutModalOpen(false); // Close the logout confirmation modal
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
            <section className="nav-section">
                <span>{greeting} |</span>
                <span>{firstname}</span>
                <span>{lastname} |</span>
                <div className="currency"></div>
                <span> {userDashboard.creditAmount}</span>
            </section>
            <div className="navigation_logo">
                <img
                    src="/assets/images/logo/logo_simple.webp"
                    alt="Logo"
                    onClick={toDashboard}
                />
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
                >
                    <span>{username}</span>
                </section>
                <div className="profile">{getInitial(username)}</div>
                {showList && (
                    <section className="drop-list">
                        <Link href="/inventory/items">Inventory</Link>{" "}
                        <Link href="/shop/items">Shop</Link>
                        <Link href="/setting/personal-information">
                            Settings
                        </Link>
                        <a onClick={handleLogoutClick}>Logout</a>{" "}
                        {/* Updated to handle logout click */}
                    </section>
                )}
            </section>
            {isOpen && <div className="overlay" onClick={handleOverlayClick} />}

            {/* Logout Confirmation Modal */}
            <Modal
                className="logout-modal"
                title="Confirm Logout"
                details="Are you sure you want to logout?"
                isOpen={isLogoutModalOpen}
                onClose={cancelLogout} // Close modal on overlay click
                buttons={[
                    <button key="cancel" onClick={cancelLogout}>
                        Cancel
                    </button>,
                    <button key="confirm" onClick={confirmLogout}>
                        Confirm
                    </button>,
                ]}
            />
        </nav>
    );
};

export default Navigation;
