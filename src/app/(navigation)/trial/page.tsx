"use client";
import useFetchSimulationWords from "@/hook/useSimulationWord";
import React from "react";

const SimulationWordsComponent = () => {
    const simu = useFetchSimulationWords(1);

    return (
        <div>
            <h1>Simulation Words</h1>
            <p>
                <strong>Word:</strong> {simu.word}
            </p>
            <p>
                <strong>Creator ID:</strong> {simu.creatorID}
            </p>
            <p>
                <strong>Silent Index:</strong> {simu.silentIndex}
            </p>
        </div>
    );
};

export default SimulationWordsComponent;
