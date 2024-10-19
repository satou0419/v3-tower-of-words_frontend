import React, { useEffect, useState } from "react";
import "./carduser.scss";
import useStudentInfo from "@/hook/useStudentInfo";
import fetchUserDetails from "@/hook/useGetUserDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faTrophy } from "@fortawesome/free-solid-svg-icons";

interface CardUserProps {
    index: number;
    username: number;
    time?: string | null;
    score?: number;
    className?: string;
    onClick?: () => void;
}

const CardUser: React.FC<CardUserProps> = ({
    index,
    username,
    time,
    score,
    className,
    onClick,
}) => {
    const characterName = (imagePath: string | null | undefined) => {
        if (!imagePath) {
            return "unknown";
        }
        const match = imagePath.match(/&\w+_(\w+)-a\d+-i\d+/);
        return match ? match[1] : "unknown";
    };

    const user = useStudentInfo(username);

    const userDetails = fetchUserDetails(username);
    const profile = characterName(userDetails.userDetails?.equipped_character);

    const totalSeconds = time ? Number(time) : 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");

    const formattedTime = !isNaN(totalSeconds) ? `${minutes}:${seconds}` : time;

    const renderRankIcon = () => {
        if (index === 0 && score !== 0) {
            return (
                <FontAwesomeIcon
                    icon={faTrophy}
                    style={{ color: "gold", fontSize: "24px" }}
                />
            );
        } else if (index === 1 && score !== 0) {
            return (
                <FontAwesomeIcon
                    icon={faTrophy}
                    style={{ color: "#C0C0C0", fontSize: "24px" }}
                />
            );
        } else if (index === 2 && score !== 0) {
            return (
                <FontAwesomeIcon
                    icon={faTrophy}
                    style={{ color: "#CE8946", fontSize: "24px" }}
                />
            );
        }
        return null; // No icon for ranks beyond 3
    };

    return (
        <section
            className={`carduser-card ${className || ""}`}
            onClick={onClick}
        >
            <section className="carduser-container">
                <span className="carduser-ranking">
                    {index + 1}
                    {renderRankIcon()}
                </span>
                <section className="banner-container">
                    <div className="banner">
                        <img
                            src={`/assets/images/sprite/profile-${profile}.png`}
                        />
                    </div>

                    <div className="details">
                        {username && (
                            <h1>
                                {user.studentInfo?.data?.lastname},&nbsp;
                                {user.studentInfo?.data?.firstname}
                            </h1>
                        )}
                        {time && <h4>Time: {formattedTime}</h4>}
                        {username && (
                            <h4>{user.studentInfo?.data?.username}</h4>
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
