"use client";

import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/utils/cn";
import { Globe2 } from "lucide-react";

interface Props {
  className?: string;
}

export const LanguageSwitch = ({ className }: Props) => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLocale();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="sr-only" id="language-switch-label">
        Dil seçimi
      </label>
      
      <div
        role="radiogroup"
        aria-labelledby="language-switch-label"
        className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            role="radio"
            aria-checked={currentLanguage.code === language.code}
            onClick={() => setLanguage(language)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
              currentLanguage.code === language.code
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {language.code === currentLanguage.code && (
              <Globe2 className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 