"use client";
import React, { useEffect, useState } from "react";
import "./trial.scss";
import { getAudio } from "@/lib/merriam-endpoint/wordnik";

export default function Trial() {
    useEffect(() => {
        getAudio("happy");
    }, []);
    return <main className="trial-wrapper"></main>;
}
