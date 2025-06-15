import React, { KeyboardEvent } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useHomyTheme } from '@/theme/hooks/useHomyTheme';
import { cn } from '@/lib/utils';
import type { ColorMode } from '@/types/TrademarkTheme';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

interface ThemeLanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  className?: string;
}

export const ThemeLanguageSelector = ({
  currentLanguage,
  onLanguageChange,
  className,
}: ThemeLanguageSelectorProps) => {
  const { theme, toggleTheme } = useHomyTheme();
  const currentTheme = theme as ColorMode;
  const [isOpen, setIsOpen] = React.useState(false);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, code: string) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleLanguageSelect(code);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        const next = e.currentTarget.nextElementSibling as HTMLLIElement;
        next?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prev = e.currentTarget.previousElementSibling as HTMLLIElement;
        prev?.focus();
        break;
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Temayı ${currentTheme === 'light' ? 'karanlık' : 'aydınlık'} moda geçir`}
      >
        {currentTheme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          {...{
            'aria-haspopup': 'listbox',
            'aria-expanded': isOpen ? 'true' : 'false',
            'aria-controls': 'language-listbox',
          }}
        >
          <span className="text-sm">{currentLang.flag}</span>
          <Globe className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
            <ul
              ref={listboxRef}
              id="language-listbox"
              role="listbox"
              className="py-1"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  role="option"
                  {...{
                    'aria-selected': lang.code === currentLanguage ? 'true' : 'false',
                  }}
                  onClick={() => handleLanguageSelect(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, lang.code)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                  tabIndex={0}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
