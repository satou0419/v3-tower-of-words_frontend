import { useState, useEffect } from "react";

/**
 * Parses a given string and extracts attackType, name, attackFrame, and idleFrame.
 *
 * @param str - The input string in the format &attackType_name-aattackFrame-iidleFrame
 * @returns An object containing the extracted values
 */
const parseImageString = (str: string) => {
    const attackTypeMatch = str.match(/^&([^_]+)/);
    const nameMatch = str.match(/_([^ -]+)/);
    const attackFrameMatch = str.match(/-a(\d+)/);
    const idleFrameMatch = str.match(/-i(\d+)/);

    const attackType = attackTypeMatch ? attackTypeMatch[1] : "";
    const name = nameMatch ? nameMatch[1] : "";
    const attackFrame = attackFrameMatch
        ? parseInt(attackFrameMatch[1], 10)
        : 0;
    const idleFrame = idleFrameMatch ? parseInt(idleFrameMatch[1], 10) : 0;

    return { attackType, name, attackFrame, idleFrame };
};

/**
 * Custom hook to parse image string.
 *
 * @param imageString - The image string to parse
 * @returns The parsed object containing attackType, name, attackFrame, and idleFrame
 */
const useImageParse = (imageString: string) => {
    const [parsedData, setParsedData] = useState({
        attackType: "",
        name: "",
        attackFrame: 0,
        idleFrame: 0,
    });

    useEffect(() => {
        const data = parseImageString(imageString);
        setParsedData(data);
    }, [imageString]);

    return parsedData;
};

export default useImageParse;
