"use client";

import { useHomyTheme } from "@/theme/hooks/useHomyTheme";
import { Moon, Sun, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

interface Props {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}

export const ThemeLanguageSelector = ({
  currentLanguage,
  onLanguageChange,
}: Props) => {
  const { theme, toggleTheme } = useHomyTheme();

  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Temayı ${theme === "light" ? "karanlık" : "aydınlık"} moda geçir`}
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </button>

      {/* Language Selector */}
      <div className="relative group">
        <button
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Dil seçimi"
          aria-haspopup="listbox"
        >
          <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {languages.find(lang => lang.code === currentLanguage)?.flag}
          </span>
        </button>

        {/* Dropdown */}
        <div className="absolute top-full left-0 mt-1 w-40 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 invisible group-hover:visible">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
              role="option"
              aria-selected={currentLanguage === lang.code}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 