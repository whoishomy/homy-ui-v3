import { useCallback, useEffect, useMemo, useContext } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/theme/themes';
import type { Brand, ColorMode, TrademarkTheme, TrademarkVisualKit } from '@/types/TrademarkTheme';
import { ThemeContext } from '@/context/ThemeContext';

interface UseThemeReturn {
  theme: TrademarkTheme;
  currentBrand: Brand;
  colorMode: ColorMode;
  systemPreference: boolean;
  setTheme: (brand: Brand) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  toggleSystemPreference: () => void;
  getTokens: () => TrademarkTheme['tokens'];
  getVisualKit: (brand?: Brand) => TrademarkVisualKit;
  isDark: boolean;
  isSystemPreferred: boolean;
}

export function useThemeContext(): TrademarkTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
        'Make sure you have wrapped your app with <ThemeProvider>.'
    );
  }

  return theme;
}

// Type-safe token access helpers
export function useThemeTokens() {
  const theme = useThemeContext();
  return theme.tokens;
}

export function useSpacing() {
  const { spacing } = useThemeTokens();
  return spacing.scale;
}

export function useColors() {
  const { colors } = useThemeTokens();
  return colors;
}

export function useTypography() {
  const { typography } = useThemeTokens();
  return typography;
}

export function useBreakpoints() {
  const { breakpoints } = useThemeContext();
  return breakpoints;
}

// Example usage:
/*
function MyComponent() {
  const spacing = useSpacing();
  const colors = useColors();
  const typography = useTypography();
  
  return (
    <div css={css`
      padding: ${spacing.lg};
      color: ${colors.primary};
      font-size: ${typography.scale.md};
    `}>
      Content
    </div>
  );
}
*/

export function useTheme(): UseThemeReturn {
  const {
    brand: currentBrand,
    colorMode,
    isSystemPreference: systemPreference,
    setBrand,
    setColorMode: setMode,
  } = useThemeStore();

  const theme = useMemo(() => {
    const baseTheme = themes[currentBrand];
    const isDarkMode = colorMode === 'dark';

    return {
      ...baseTheme,
      colorMode,
      tokens: {
        ...baseTheme.tokens,
        ...(isDarkMode && baseTheme.darkTokens),
      },
      kits: Object.entries(baseTheme.kits).reduce(
        (acc, [brand, kit]) => ({
          ...acc,
          [brand]: {
            ...kit,
            visualIdentity: {
              ...kit.visualIdentity,
              ...(isDarkMode && kit.visualIdentity.dark),
            },
          },
        }),
        {} as Record<Brand, TrademarkVisualKit>
      ),
    };
  }, [currentBrand, colorMode]);

  const setTheme = useCallback(
    (brand: Brand) => {
      setBrand(brand);
    },
    [setBrand]
  );

  const toggleColorMode = useCallback(() => {
    setMode(colorMode === 'light' ? 'dark' : 'light');
  }, [colorMode, setMode]);

  const toggleSystemPreference = useCallback(() => {
    useThemeStore.getState().toggleSystemPreference();
  }, []);

  const getTokens = useCallback(() => theme.tokens, [theme]);

  const getVisualKit = useCallback(
    (brand: Brand = currentBrand) => {
      return theme.kits[brand];
    },
    [theme, currentBrand]
  );

  // Handle system color scheme changes
  useEffect(() => {
    if (!systemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setMode(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemPreference, setMode]);

  return {
    theme,
    currentBrand,
    colorMode,
    systemPreference,
    setTheme,
    setColorMode: setMode,
    toggleColorMode,
    toggleSystemPreference,
    getTokens,
    getVisualKit,
    isDark: colorMode === 'dark',
    isSystemPreferred: systemPreference,
  };
}
