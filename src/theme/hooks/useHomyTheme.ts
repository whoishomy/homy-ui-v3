import { useTheme } from '../contexts/ThemeContext';

export const useHomyTheme = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
  };
};
