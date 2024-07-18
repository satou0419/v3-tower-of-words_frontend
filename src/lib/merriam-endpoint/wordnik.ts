const API_KEY = process.env.NEXT_PUBLIC_WORDNIK_API_KEY;
const BASE_URL = "https://api.wordnik.com/v4/word.json";

export const fetchAudio = async (word: string) => {
    const url = `${BASE_URL}/${word}/audio?useCanonical=false&limit=2&api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const macmillanAudio = data.find(
            (audio: any) => audio.createdBy === "macmillan"
        );
        const audioFile = macmillanAudio || data[0];

        if (audioFile) {
            return {
                fileUrl: audioFile.fileUrl,
                duration: audioFile.duration,
            };
        } else {
            throw new Error("No audio file found");
        }
    } catch (error) {
        console.error("Error fetching word audio:", error);
        throw error;
    }
};

export const fetchSyllableCount = async (word: string) => {
    const url = `${BASE_URL}/${word}/hyphenation?useCanonical=false&limit=2&api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error("Error fetching syllable count:", error);
        throw error;
    }
};

export const fetchPronunciation = async (word: string) => {
    const url = `${BASE_URL}/${word}/pronunciations?useCanonical=false&limit=2&api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const ahdPronunciation = data.find(
            (pronunciation: any) => pronunciation.rawType === "ahd-5"
        );

        const pronunciation = ahdPronunciation
            ? ahdPronunciation.raw
            : data[0]
            ? data[0].raw
            : null;

        if (pronunciation) {
            console.log(pronunciation);
            return pronunciation;
        } else {
            throw new Error("No pronunciation found");
        }
    } catch (error) {
        console.error("Error fetching pronunciation:", error);
        throw error;
    }
};

export const fetchDefinition = async (word: string) => {
    const url = `${BASE_URL}/${word}/definitions?limit=2&includeRelated=false&useCanonical=false&includeTags=false&api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const entry = data.find((entry: any) => entry.text);
        if (entry) {
            return {
                definition: entry.text,
                partOfSpeech: entry.partOfSpeech,
            };
        } else {
            throw new Error("No definition found");
        }
    } catch (error) {
        console.error("Error fetching definition:", error);
        throw error;
    }
};
