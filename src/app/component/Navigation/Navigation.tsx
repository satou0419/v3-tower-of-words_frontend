"use client";
import React, { useEffect, useRef, useState } from "react";
import "./navigation.css";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    // const toggleDropdown = () => {
    //     setIsOpen(!isOpen);
    // };

    // let toggleRef = useRef();
    // useEffect(() => {
    //     let handler = (e) => {
    //         if (!toggleRef.current.contains(e.target)) {
    //             setIsOpen(false);
    //             console.log(toggleRef.current);
    //         }
    //     };
    //     document.addEventListener("mousedown", handler);
    // });

    return (
        <nav className="navigation">
            <span>Username: </span>
            <span>Lastname: </span>

            {/* <section className={`navigation-dropdown ${isOpen ? "open" : ""}`}>
                <div
                    className="navigation-profile"
                    onClick={toggleDropdown}
                ></div>
                <div
                    className={`navigation-dropdown_list ${
                        isOpen ? "open" : ""
                    }`}
                ></div>
            </section> */}
            <div className="navigation_logo">
                <img src="/assets/images/logo/logo_simple.webp" alt="Logo" />
            </div>
        </nav>
    );
}
