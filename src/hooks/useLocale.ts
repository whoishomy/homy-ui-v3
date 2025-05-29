import { useCallback, useEffect } from "react";
import { useLanguageStore, type Language, SUPPORTED_LANGUAGES } from "@/store/language/languageStore";

interface UseLocaleReturn {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  supportedLanguages: Language[];
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
}

export const useLocale = (): UseLocaleReturn => {
  const { currentLanguage, setLanguage } = useLanguageStore();

  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.direction;
  }, [currentLanguage]);

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(currentLanguage.code, options).format(dateObj);
    },
    [currentLanguage.code]
  );

  const formatNumber = useCallback(
    (number: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLanguage.code, options).format(number);
    },
    [currentLanguage.code]
  );

  return {
    currentLanguage,
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    formatDate,
    formatNumber
  };
}; 