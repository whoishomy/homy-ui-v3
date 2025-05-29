import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = {
  code: string;
  name: string;
  direction: "ltr" | "rtl";
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "tr", name: "Türkçe", direction: "ltr" },
  { code: "en", name: "English", direction: "ltr" }
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: SUPPORTED_LANGUAGES[0],
      setLanguage: (language) => set({ currentLanguage: language })
    }),
    {
      name: "language-store",
      partialize: (state) => ({ currentLanguage: state.currentLanguage })
    }
  )
); 