import React, { createContext, useContext } from 'react';
import { ThemeProvider } from '@emotion/react';
import type { TrademarkTheme } from '@/types/TrademarkTheme';
import { createTheme } from '@/theme/createTheme';
import { baseTokens } from '@/theme/tokens';
import { useThemeStore } from '@/store/themeStore';
import type { BrandName } from '@/types/BrandName';
import { defaultTheme } from '@/types/TrademarkTheme';

interface ThemeContextType {
  theme: TrademarkTheme;
  currentBrand: BrandName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function TrademarkThemeProvider({ children }: { children: React.ReactNode }) {
  const { brand, colorMode } = useThemeStore();

  // Generate theme based on current preferences
  const theme = React.useMemo(() => {
    const baseTheme = createTheme({ colorMode, tokens: baseTokens });
    return {
      ...baseTheme,
      ...defaultTheme,
      colorMode,
      brand,
    } as TrademarkTheme;
  }, [brand, colorMode]);

  const value = React.useMemo(
    () => ({
      theme,
      currentBrand: brand,
    }),
    [theme, brand]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTrademarkTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTrademarkTheme must be used within a TrademarkThemeProvider');
  }
  return context;
}

// Usage example:
/*
function App() {
  return (
    <TrademarkThemeProvider>
      <TrademarkText variant="title">HOMY</TrademarkText>
    </TrademarkThemeProvider>
  );
}

function BrandSwitcher() {
  const { switchBrand } = useTrademarkTheme();
  return (
    <button onClick={() => switchBrand('neuro')}>
      Switch to Neuro
    </button>
  );
}
*/
