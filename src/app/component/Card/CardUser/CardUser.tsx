import React, { useEffect, useState } from "react";
import "./carduser.scss";
import useStudentInfo from "@/hook/useStudentInfo";

interface CardUserProps {
    username: number;
    time?: string | null;
    score?: number;
    className?: string;
    onClick?: () => void;
}

const CardUser: React.FC<CardUserProps> = ({
    username,
    time,
    score,
    className,
    onClick,
}) => {
    const user = useStudentInfo(username);

    const totalSeconds = time ? Number(time) : 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");

    const formattedTime = `${minutes}:${seconds}`;

    console.log(user.studentInfo?.data?.username);

    return (
        <section className={`carduser-card ${className || ""}`} onClick={onClick}>
            <section className="carduser-container">
                <section className="banner-container">
                    <div className="banner"></div>

                    
                        <div className="details">
                            {username && (
                                <h1>{user.studentInfo?.data?.username}</h1>
                            )}
                            {time && (
                                <h4>Average Time: {formattedTime}</h4>
                            )}
                        </div>
                    
                </section>

                {score !== undefined && (
                    <section className="user-info">
                        <h1>Score</h1>
                        <span>{score}</span>
                    </section>
                )}
            </section>
        </section>
    );
};

export default CardUser;
