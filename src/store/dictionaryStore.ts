import create from "zustand";

interface Word {
    word: string;
    definition: string;
    audio: string;
    partOfSpeech: string;
}

interface WordState {
    words: Word[];
    addWord: (word: Word) => void;
    removeWord: (word: string) => void;
}

const useWordStore = create<WordState>((set) => ({
    words: [],

    addWord: (word) =>
        set((state) => ({
            words: [...state.words, word],
        })),

    removeWord: (word) =>
        set((state) => ({
            words: state.words.filter((w) => w.word !== word),
        })),
}));

export default useWordStore;
