const dictionary = async (word: string) => {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch dictionary data");
        }
        const data = await response.json();

        // Extract US pronunciation
        const usPronunciation = data[0]?.phonetics?.find((phonetic: any) =>
            phonetic.audio.includes("-us.mp3")
        );

        // If US pronunciation is not available, return the first available pronunciation
        const pronunciation = usPronunciation
            ? usPronunciation
            : data[0]?.phonetics?.[0];

        return {
            word: data[0].word,
            phonetic: pronunciation ? pronunciation.text : null,
            audio: pronunciation ? pronunciation.audio : null,
            meanings: data[0]?.meanings || [],
        };
    } catch (error) {
        throw new Error("Failed to fetch word data");
    }
};

export default dictionary;
