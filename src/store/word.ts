import { create } from "zustand";
import {
    fetchAudio,
    fetchSyllableCount,
    fetchDefinition,
    fetchPronunciation,
} from "@/lib/merriam-endpoint/wordnik";

interface WordState {
    word: string;
    definition: string | null;
    partOfSpeech: string | null;
    syllableCount: number | null;
    audioUrl: string | null;
    audioDuration: number | null;
    pronunciation: string | null;
    error: string | null;
    fetchWordData: (word: string) => void;
}

export const useWordStore = create<WordState>((set) => ({
    word: "",
    definition: null,
    partOfSpeech: null,
    syllableCount: null,
    audioUrl: null,
    audioDuration: null,
    pronunciation: null,
    error: null,
    fetchWordData: async (word: string) => {
        set({ word, error: null });
        try {
            const { definition, partOfSpeech } = await fetchDefinition(word);
            const syllableCount = await fetchSyllableCount(word);
            const { fileUrl: audioUrl, duration: audioDuration } =
                await fetchAudio(word);
            const pronunciation = await fetchPronunciation(word);

            set({
                definition,
                partOfSpeech,
                syllableCount,
                audioUrl,
                audioDuration,
                pronunciation,
                error: null,
            });
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
