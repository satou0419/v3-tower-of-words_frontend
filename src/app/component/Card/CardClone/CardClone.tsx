import React from "react";
import "./cardclone.scss";

interface CardSettingProps {
    simulationName?: string;
    roomCode?: string;
    roomName?: string;
    roomID?: number;
    selected?: boolean;
    onClick: () => void;
}

const CardClone: React.FC<CardSettingProps> = ({
    simulationName,
    roomCode,
    roomName,
    roomID,
    selected,
    onClick,
}) => {
    return (
        <section
            className={`cardclone-card ${selected ? "selected" : ""}`}
            onClick={onClick}
        >
            <section className="cardclone-card-top">
                <span className="cardclone-card-name">{simulationName}</span>
                <span>Room Code</span>
                <span className="cardclone-card-code">{roomCode}</span>
            </section>
            <div className="line">
                <span className={`line-text ${selected ? "selected" : ""}`}>
                    from
                </span>
            </div>
            <section className="cardclone-card-bottom">
                <section className="cardclone-card-room-top">
                    <span>Room Name:</span>
                    <span className="cardclone-card-room-name">{roomName}</span>
                </section>
                <section className="cardclone-card-room-bottom">
                    <span>Room ID:</span>
                    <span className="cardclone-card-room-code">{roomID}</span>
                </section>
            </section>
        </section>
    );
};

export default CardClone;
