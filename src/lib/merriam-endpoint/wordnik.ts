const API_KEY = process.env.NEXT_PUBLIC_WORDNIK_API_KEY;
const BASE_URL = "https://api.wordnik.com/v4/word.json";

export const getAudioFileUrl = async (word: string): Promise<string | null> => {
    const url = `${BASE_URL}/${word}/audio?useCanonical=false&limit=50&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Find the first fileUrl created by "macmillan"
        const macmillanAudio = data.find(
            (item: any) => item.createdBy === "macmillan"
        );

        // Extract fileUrl if found, otherwise return null
        const fileUrl = macmillanAudio ? macmillanAudio.fileUrl : null;

        return fileUrl;
    } catch (error) {
        console.error("Error fetching word audio:", error);
        return null;
    }
};
