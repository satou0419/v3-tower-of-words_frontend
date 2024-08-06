import React, { useRef, useEffect } from "react";
import Fireworks from "fireworks-js";

interface FireworksProps {
    show: boolean;
}

const FireworksComponent: React.FC<FireworksProps> = ({ show }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (show && canvasRef.current) {
            const fireworks = new Fireworks(canvasRef.current, {
                // Remove unsupported colors property
                particles: 100,
                acceleration: 1.02,
                friction: 0.97,
                gravity: 0.1,
                explosion: 5,
                traceLength: 3,
                traceSpeed: 10,
            });

            fireworks.start();

            return () => fireworks.stop();
        }
    }, [show]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
            }}
        />
    );
};

export default FireworksComponent;
