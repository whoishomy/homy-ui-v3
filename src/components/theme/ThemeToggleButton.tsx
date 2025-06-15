'use client';

import { useHomyTheme } from '@/theme/hooks/useHomyTheme';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useHomyTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Tema Değiştir"
    >
      {theme === 'light' ? (
        <Moon data-testid="moon-icon" className="h-5 w-5 text-gray-800" />
      ) : (
        <Sun data-testid="sun-icon" className="h-5 w-5 text-yellow-400" />
      )}
    </button>
  );
};
