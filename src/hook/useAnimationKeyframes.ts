import { useEffect, useState } from "react";

const useAnimationKeyframes = (
    animationName: string,
    name: string,
    idleFrames: number,
    attackFrames: number,
    attackType?: string // Added attackType parameter
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

            if (attackType === "melee") {
                keyframes += `
                    @keyframes expand-width-${name} {
                        0% {
                            width: 360px;
                        }
                        100% {
                            width: 90%;
                        }
                    }

                    @keyframes shrink-width-${name} {
                        0% {
                            width: 90%;
                        }
                        100% {
                            width: 360px;
                        }
                    }
                `;
            }

            setKeyframesCSS(keyframes);
        };

        generateKeyframes();
    }, [animationName, idleFrames, attackFrames, name, attackType]);

    return keyframesCSS;
};

export default useAnimationKeyframes;
