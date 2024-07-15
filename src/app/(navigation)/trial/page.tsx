"use client";
import useAnimationKeyframes from "@/hook/useAnimationKeyframes";
import useImageParse from "@/hook/useImageParse";
import React, { useState } from "react";

const AnimationComponent: React.FC = () => {
    const characterDetails = useImageParse("&range_cannon-a22-i17");
    const characterAnimation = useAnimationKeyframes(
        "idle",
        characterDetails.idleFrame,
        characterDetails.attackFrame
    );
    return (
        <div
            style={{
                border: "2px solid white",
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundImage: `url("/assets/images/sprite/${characterDetails.name}.png")`,
                width: `360px`, // Width of each frame in the sprite sheet
                height: `360px`, // Adjust based on sprite sheet
                animation: `idle-${characterDetails.name} 1s steps(17) infinite`,
            }}
        >
            Animate me!
            <style>
                {`
                ${characterAnimation}
                `}
            </style>
            {characterAnimation}
            {characterDetails.attackFrame}
        </div>
    );
};

export default AnimationComponent;
