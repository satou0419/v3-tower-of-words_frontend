import { useEffect, useState } from "react"

const useAnimationKeyframes = (
    animationName: string,
    name: string,
    idleFrames: number,
    attackFrames: number,
    attackType?: string
) => {
    const [keyframesCSS, setKeyframesCSS] = useState("")
    const [frameWidth, setFrameWidth] = useState(360)
    const [frameHeight, setFrameHeight] = useState(360)

    useEffect(() => {
        // Function to update frame size based on screen width
        const updateFrameSize = () => {
            if (window.innerWidth > 768) {
                setFrameWidth(360)
                setFrameHeight(360)
            } else if (window.innerWidth > 600) {
                setFrameWidth(260)
                setFrameHeight(260)
            } else if (window.innerWidth > 425) {
                setFrameWidth(180)
                setFrameHeight(180)
            } else {
                setFrameWidth(120)
                setFrameHeight(120)
            }
        }

        // Call updateFrameSize on mount and whenever the screen resizes
        updateFrameSize()
        window.addEventListener("resize", updateFrameSize)

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener("resize", updateFrameSize)
    }, [])

    useEffect(() => {
        const generateKeyframes = () => {
            let keyframes = `@keyframes ${animationName}-${name} {`

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
                `
            } else if (animationName === "attack") {
                keyframes += `
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: -${attackFrames * frameWidth}px 0;
                    }
                `
            }

            keyframes += `}`

            if (attackType === "melee") {
                keyframes += `
                    @keyframes expand-width-${name} {
                        0% {
                            width: ${frameWidth}px;
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
                            width: ${frameWidth}px;
                        }
                    }
                `
            }

            setKeyframesCSS(keyframes)
        }

        generateKeyframes()
    }, [
        animationName,
        idleFrames,
        attackFrames,
        name,
        attackType,
        frameWidth,
        frameHeight,
    ])

    return keyframesCSS
}

export default useAnimationKeyframes
