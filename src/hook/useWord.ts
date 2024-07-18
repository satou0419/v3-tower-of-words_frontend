import { useState, useEffect } from "react";
import dictionary from "@/lib/merriam-endpoint/dictionary";

interface WordData {
    word: string;
    pronunciation: string;
    audio: string;
    definition: string;
    playAudio: () => void;
}

const useWord = (initialWord: string) => {
    const [wordData, setWordData] = useState<WordData | null>(null);

    useEffect(() => {
        const fetchWordData = async (word: string) => {
            try {
                const dictionaryData = await dictionary(word);
                const audioSrc = dictionaryData.audio;
                const pronunciation = dictionaryData.phonetic;
                const definition =
                    dictionaryData.meanings[0]?.definitions[0]?.definition;

                // Create an Audio object and load the audio file
                const audio = new Audio(audioSrc);
                await audio.load(); // Ensure audio file is loaded before play

                const playAudio = () => {
                    if (audio) {
                        audio.play().catch((error) => {
                            console.error("Error playing audio:", error);
                        });
                    }
                };

                setWordData({
                    word,
                    pronunciation,
                    audio: audioSrc,
                    definition,
                    playAudio,
                });
            } catch (error) {
                console.error("Error fetching word data:", error);
            }
        };

        if (initialWord) {
            fetchWordData(initialWord);
        }
    }, [initialWord]);

    return wordData;
};

export default useWord;
