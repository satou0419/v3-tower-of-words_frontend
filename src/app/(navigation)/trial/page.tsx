"use client";
import React, { useState } from "react";
import "./trial.scss";
import useMerriam from "@/hook/useMerriam";

export default function Trial() {
    const [search, setSearch] = useState("");
    const word = useMerriam(search);

    const handleChange = (event: any) => {
        setSearch(event.target.value);
    };

    return (
        <>
            <input
                type="search"
                value={search}
                onChange={handleChange}
                placeholder="Search for a word"
            />
            <p>{word?.definition}</p>
        </>
    );
}
