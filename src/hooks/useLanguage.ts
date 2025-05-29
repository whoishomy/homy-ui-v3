import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'tr' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<Language, string>>;
  addTranslations: (key: string, translations: Record<Language, string>) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'tr',
      setLanguage: (language) => set({ language }),
      translations: {},
      addTranslations: (key, translations) =>
        set((state) => ({
          translations: {
            ...state.translations,
            [key]: translations,
          },
        })),
    }),
    {
      name: 'language-storage',
    }
  )
);

export const useLanguage = () => {
  const { language, setLanguage, translations, addTranslations } = useLanguageStore();

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || key;
  };

  return {
    language,
    setLanguage,
    t,
    addTranslations,
  };
}; 