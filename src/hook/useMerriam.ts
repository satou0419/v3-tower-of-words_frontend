// src/hooks/useMerriam.ts
import { useEffect } from "react";
import useMerriamStore, { MerriamData } from "@/store/merriam";

const useMerriam = (initialWord: string = ""): MerriamData | null => {
    const wordData = useMerriamStore((state) => state.wordData);
    const fetchMerriamData = useMerriamStore((state) => state.fetchMerriamData);

    useEffect(() => {
        if (initialWord && initialWord.trim() !== "") {
            fetchMerriamData(initialWord);
        }
    }, [initialWord, fetchMerriamData]);

    // useEffect(() => {
    //     // Play audio on word change
    //     if (wordData && wordData.playAudio) {
    //         setTimeout(() => {
    //             wordData.playAudio();
    //         }, 1500);
    //     }
    // }, [wordData]); // Trigger on word change

    return wordData;
};

export default useMerriam;
