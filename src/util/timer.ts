import { useState, useEffect } from "react";

const useTimer = () => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [stopTime, setStopTime] = useState<number | null>(null);
    const [running, setRunning] = useState<boolean>(false);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const start = () => {
        if (!running) {
            const now = Date.now();
            setStartTime(now);
            setRunning(true);
            if (intervalId) clearInterval(intervalId);
            const id = setInterval(() => {
                setTotalTime((prev) => prev + 1000);
            }, 1000);
            setIntervalId(id);
        }
    };

    const stop = () => {
        if (running) {
            const now = Date.now();
            if (startTime) {
                setTotalTime((prev) => prev + (now - startTime));
            }
            setStopTime(now);
            setRunning(false);
            if (intervalId) clearInterval(intervalId);
        }
    };

    const reset = () => {
        if (intervalId) clearInterval(intervalId);
        setStartTime(null);
        setStopTime(null);
        setRunning(false);
        setTotalTime(0);
    };

    const fullStop = () => {
        reset();
    };

    const getTime = () => {
        if (startTime) {
            if (running) {
                return totalTime + (Date.now() - startTime);
            }
            return totalTime + (stopTime ? stopTime - startTime : 0);
        }
        return totalTime;
    };

    const getFormattedTime = () => {
        const time = getTime();
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor(time / (1000 * 60 * 60));
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    };

    const getFormattedTimeInHours = () => {
        const time = getTime();
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor(time / (1000 * 60 * 60));

        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes.toString()}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
    };

    const getFormattedTimeInSeconds = () => {
        return Math.floor(getTime() / 1000);
    };

    return {
        start,
        stop,
        reset,
        fullStop,
        getFormattedTime,
        getFormattedTimeInHours,
        getFormattedTimeInSeconds,
    };
};

export default useTimer;
