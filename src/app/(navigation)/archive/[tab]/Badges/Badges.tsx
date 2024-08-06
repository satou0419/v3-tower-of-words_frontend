"use client";
import React, { useState, useEffect } from "react";
import Loading from "@/app/loading"; // Import the Loading component

const Badges = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate an API call or some async operation
        const fetchBadges = async () => {
            try {
                // Simulate a delay
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error("Failed to fetch badges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, []);

    if (loading) {
        // return <Loading />; // Render Loading component while data is being loaded
        <div>Loading...</div>;
    }

    return (
        <section>
          
            <h1>Badges</h1>
            {/* Render badges here */}
        </section>
    );
};

export default Badges;
