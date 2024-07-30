import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

interface SimulationWords {
    simulationWordsID: number;
    creatorID: number | null;
    word: string | null;
    silentIndex: string | null;
}

const useFetchAllSimulationWords = (wordIDs: number[]) => {
    const [simulationWords, setSimulationWords] = useState<SimulationWords[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchWordsDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchWordPromises = wordIDs.map((wordID) =>
                    fetch(`${BASE_URL}/simulation_words/view/${wordID}`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch details for word ID ${wordID}`);
                            }
                            return response.json();
                        })
                        .then((result) => ({
                            simulationWordsID: wordID,
                            creatorID: result.data.creatorID,
                            word: result.data.word,
                            silentIndex: result.data.silentIndex,
                        }))
                );

                const wordsDetails = await Promise.all(fetchWordPromises);
                setSimulationWords(wordsDetails);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        if (wordIDs.length > 0) {
            fetchWordsDetails();
        } else {
            setSimulationWords([]);
        }
    }, [wordIDs]);

    return { simulationWords, loading, error };
};

export default useFetchAllSimulationWords;