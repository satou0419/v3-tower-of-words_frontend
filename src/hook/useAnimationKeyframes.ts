// useAnimationKeyframes.ts
import { useEffect, useState } from "react";

const useAnimationKeyframes = (
    animationName: string,
    name: string,

    idleFrames: number,
    attackFrames: number
) => {
    const [keyframesCSS, setKeyframesCSS] = useState("");

    useEffect(() => {
        const generateKeyframes = () => {
            const frameWidth = 360; // Width of each frame in the sprite sheet
            const frameHeight = 360; // Height of each frame in the sprite sheet

            let keyframes = `@keyframes ${animationName}-${name} {`;

            if (animationName === "idle") {
                keyframes += `
                    0% {
                        background-position: 0 -${frameHeight}px;
                    }

                    100% {
                        background-position: -${
                            idleFrames * frameWidth
                        }px -${frameHeight}px;
                    }
                `;
            } else if (animationName === "attack") {
                keyframes += `
                    0% {
                        background-position: 0 0;
                    }

                    100% {
                        background-position: -${attackFrames * frameWidth}px 0;
                    }
                `;
            }

            keyframes += `}`;

            setKeyframesCSS(keyframes);
        };

        generateKeyframes();
    }, [animationName, idleFrames, attackFrames, name]);

    return keyframesCSS;
};

export default useAnimationKeyframes;
