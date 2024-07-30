import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

const useFetchSimulationWords = (simulationWordsID: number) => {
    const [word, setWord] = useState<string | null>(null);
    const [creatorID, setCreatorID] = useState<number | null>(null);
    const [silentIndex, setSilentIndex] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/simulation_words/view/${simulationWordsID}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch simulation words");
                }

                const result = await response.json();
                const { word, creatorID, silentIndex } = result.data;
                setWord(word);
                setCreatorID(creatorID);
                setSilentIndex(silentIndex);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [simulationWordsID]);

    return {
        word,
        creatorID,
        silentIndex,
        loading,
        error,
    };
};

export default useFetchSimulationWords;
