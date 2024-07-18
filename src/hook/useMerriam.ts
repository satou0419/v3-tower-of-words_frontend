import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_MERRIAM_API_KEY;
const url = `https://dictionaryapi.com/api/v3/references/collegiate/json`;

interface MerriamData {
    exists: boolean;
    partOfSpeech?: string;
    pronunciation?: string;
    audio?: string;
    definition?: string;
    message?: string;
    word?: string;
    playAudio?: () => void;
}

const fetchMerriam = async (word: string): Promise<MerriamData> => {
    try {
        const response = await fetch(`${url}/${word}?key=${API_KEY}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Check if cxs exists
        const cxsExists = !!data[0]?.cxs;

        // Prepare result object
        let result: MerriamData = {
            exists: cxsExists,
            word,
        };

        if (!cxsExists) {
            // If cxs does not exist, populate result with regular data
            result = {
                ...result,
                partOfSpeech: data[0]?.fl,
                pronunciation: data[0]?.hwi?.prs[0]?.mw,
                audio: data[0]?.hwi?.prs[0]?.sound?.audio,
                definition: data[0]?.shortdef?.[0],
            };
        } else {
            // If cxs exists, populate result with cxs information
            result = {
                ...result,
                definition: `${data[0].cxs[0].cxl} ${data[0].cxs[0].cxtis[0].cxt}`,
                message: `This word has limited resources. Do you want to proceed with ${data[0].cxs[0].cxtis[0].cxt}?`,
            };
        }

        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow error to be handled by calling code
    }
};

const useMerriam = (initialWord: string): MerriamData | null => {
    const [data, setData] = useState<MerriamData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchMerriam(initialWord);
                setData({
                    ...result,
                    playAudio: () => {
                        if (result.audio) {
                            const audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${result.audio.charAt(
                                0
                            )}/${result.audio}.mp3`;
                            const audio = new Audio(audioUrl);
                            audio.play();
                        }
                    },
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (initialWord.trim() !== "") {
            fetchData();
        } else {
            // Reset data when word is empty
            setData(null);
        }
    }, [initialWord]);

    return data;
};

export default useMerriam;
