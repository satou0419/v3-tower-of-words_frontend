import { useState, useRef, useCallback } from "react";

interface Countdown {
    time: number;
    start: () => void;
    pause: () => void;
    reset: (newTime?: number) => void;
}

const useCountdown = (initialTime: number): Countdown => {
    const [time, setTime] = useState<number>(initialTime);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        return 0;
                    }
                });
            }, 1000);
        }
    }, []);

    const pause = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(
        (newTime: number = initialTime) => {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setTime(newTime);
        },
        [initialTime]
    );

    return { time, start, pause, reset };
};

export default useCountdown;
