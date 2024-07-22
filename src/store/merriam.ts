// src/store/merriam.ts
import { create } from "zustand";

export interface MerriamData {
    word: string;
    pronunciation: string | null;
    audio: string | null;
    definition: string | null;
    partOfSpeech: string | null;
    message: string | null;
    exists: boolean;
    syllable: number;
    playAudio: () => void;
}

interface MerriamState {
    wordData: MerriamData | null;
    error: string | null;
    fetchMerriamData: (word: string) => Promise<void>;
}

const API_KEY = process.env.NEXT_PUBLIC_MERRIAM_API_KEY;
const url = `https://dictionaryapi.com/api/v3/references/collegiate/json`;

const useMerriamStore = create<MerriamState>((set) => ({
    wordData: null,
    error: null,
    fetchMerriamData: async (word: string) => {
        try {
            const response = await fetch(`${url}/${word}?key=${API_KEY}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            const cxsExists = !!data[0]?.cxs;

            let result: MerriamData = {
                word,
                exists: cxsExists,
                pronunciation: null,
                audio: null,
                definition: null,
                partOfSpeech: null,
                message: null,
                syllable: 1, // Default to 1 syllable
                playAudio: () => {}, // Default no-op function
            };

            if (!cxsExists) {
                const pronunciation = data[0]?.hwi?.prs[0]?.mw || null;
                const syllable = pronunciation
                    ? (pronunciation.match(/-/g)?.length || 0) + 1
                    : 1;

                result = {
                    ...result,
                    partOfSpeech: data[0]?.fl,
                    pronunciation,
                    audio: data[0]?.hwi?.prs[0]?.sound?.audio,
                    definition: data[0]?.shortdef?.[0],
                    syllable,
                    playAudio: () => {
                        if (data[0]?.hwi?.prs[0]?.sound?.audio) {
                            const audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${data[0].hwi.prs[0].sound.audio.charAt(
                                0
                            )}/${data[0].hwi.prs[0].sound.audio}.mp3`;
                            const audio = new Audio(audioUrl);
                            audio.play();
                        }
                    },
                };
            } else {
                result = {
                    ...result,
                    definition: `${data[0].cxs[0].cxl} ${data[0].cxs[0].cxtis[0].cxt}`,
                    message: `This word has limited resources. Do you want to proceed with ${data[0].cxs[0].cxtis[0].cxt}?`,
                };
            }

            set({ wordData: result, error: null });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },
}));

export default useMerriamStore;
