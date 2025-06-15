import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeTokens } from '@/types/ThemeTokens';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';
import { generateThemeTokens } from '@/utils/theme';

interface Theme {
  brand: Brand;
  colorMode: ColorMode;
  tokens: ThemeTokens;
}

interface ThemeContextType {
  brand: Brand;
  colorMode: ColorMode;
  tokens: ThemeTokens;
  setBrand: (brand: Brand) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleSystemPreference: () => void;
  isSystemPreference: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialBrand?: Brand;
  initialColorMode?: ColorMode;
}

export function ThemeProvider({
  children,
  initialBrand = 'homy',
  initialColorMode = 'light',
}: ThemeProviderProps) {
  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  const [isSystemPreference, setIsSystemPreference] = useState(false);

  useEffect(() => {
    const savedBrand = localStorage.getItem('theme-brand');
    const savedColorMode = localStorage.getItem('theme-color-mode');
    const savedSystemPreference = localStorage.getItem('theme-system-preference');

    if (savedBrand) setBrand(savedBrand as Brand);
    if (savedColorMode) setColorMode(savedColorMode as ColorMode);
    if (savedSystemPreference) setIsSystemPreference(savedSystemPreference === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-brand', brand);
    localStorage.setItem('theme-color-mode', colorMode);
    localStorage.setItem('theme-system-preference', String(isSystemPreference));
  }, [brand, colorMode, isSystemPreference]);

  useEffect(() => {
    if (!isSystemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setColorMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    setColorMode(mediaQuery.matches ? 'dark' : 'light');

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemPreference]);

  const handleSetBrand = (newBrand: Brand) => {
    setBrand(newBrand);
  };

  const handleSetColorMode = (newMode: ColorMode) => {
    setColorMode(newMode);
    setIsSystemPreference(false);
  };

  const handleToggleSystemPreference = () => {
    setIsSystemPreference(!isSystemPreference);
  };

  const tokens = generateThemeTokens({ brand, colorMode });

  const value: ThemeContextType = {
    brand,
    colorMode,
    tokens,
    setBrand: handleSetBrand,
    setColorMode: handleSetColorMode,
    toggleSystemPreference: handleToggleSystemPreference,
    isSystemPreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
