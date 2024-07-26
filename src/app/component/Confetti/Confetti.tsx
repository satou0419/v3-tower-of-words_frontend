import React from "react";
import Confetti from "react-confetti";
import "./confetti.scss";

const ConfettiWrapper: React.FC<{ showConfetti: boolean }> = ({
    showConfetti,
}) => {
    return (
        <div className={`confetti-wrapper ${showConfetti ? "visible" : ""}`}>
            {showConfetti && <Confetti />}
        </div>
    );
};

export default ConfettiWrapper;
