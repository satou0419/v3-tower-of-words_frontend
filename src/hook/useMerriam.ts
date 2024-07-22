// src/hooks/useMerriam.ts
import { useEffect, useState } from "react";
import useMerriamStore, { MerriamData } from "@/store/merriam";

const useMerriam = (initialWord: string = ""): MerriamData | null => {
    const [error, setError] = useState<string | null>(null);
    const wordData = useMerriamStore((state) => state.wordData);
    const fetchMerriamData = useMerriamStore((state) => state.fetchMerriamData);

    useEffect(() => {
        if (initialWord && initialWord.trim() !== "") {
            const fetchData = async () => {
                try {
                    await fetchMerriamData(initialWord);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError("No data available");
                }
            };

            fetchData();
        }
    }, [initialWord, fetchMerriamData]);

    // Handle error state here if needed
    if (error) {
        console.error(error);
    }

    return wordData;
};

export default useMerriam;
