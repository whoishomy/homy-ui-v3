import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/theme/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentBrand, colorMode, systemPreference } = useThemeStore();

  useEffect(() => {
    // Handle system color scheme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (systemPreference) {
        useThemeStore.getState().setColorMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemPreference]);

  // Apply theme classes to root element
  useEffect(() => {
    const root = document.documentElement;
    const brandClass = `theme-${currentBrand.toLowerCase()}`;
    const colorClass = `theme-${colorMode}`;

    // Remove existing theme classes
    Object.keys(themes).forEach((theme) => {
      root.classList.remove(`theme-${theme.toLowerCase()}`);
    });
    root.classList.remove('theme-light', 'theme-dark');

    // Add new theme classes
    root.classList.add(brandClass, colorClass);
  }, [currentBrand, colorMode]);

  return <>{children}</>;
}
