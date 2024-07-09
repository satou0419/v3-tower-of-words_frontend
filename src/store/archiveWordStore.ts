import viewArchive from "@/lib/archive-endpoint/viewArchive";
import { create } from "zustand";

interface ArchiveWord {
    archiveWordsID: number;
    userID: number;
    word: string;
    checked: boolean;

    pronunciation: string;
    partOfSpeech: string;
    definition: string;
}

interface ArchiveWordState {
    archiveWords: ArchiveWord[];
    setArchiveWords: (archiveWords: ArchiveWord[]) => void;
    toggleChecked: (archiveWordsID: number) => void;
}

export const useArchiveWordStore = create<ArchiveWordState>((set) => ({
    archiveWords: [],
    setArchiveWords: (archiveWords) => set({ archiveWords }),
    toggleChecked: (archiveWordsID) =>
        set((state) => ({
            archiveWords: state.archiveWords.map((word) =>
                word.archiveWordsID === archiveWordsID
                    ? { ...word, checked: !word.checked }
                    : word
            ),
        })),
}));

export const fetchAndSetArchiveWords = async () => {
    try {
        const data = await viewArchive();
        if (data && data.data) {
            useArchiveWordStore.getState().setArchiveWords(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch archive words:", error);
    }
};
