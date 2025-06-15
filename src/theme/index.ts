import { createTheme } from './createTheme';
import { baseTokens } from './tokens';
import type { Theme, ColorMode } from './types';

export * from './types';
export * from './tokens';
export * from './createTheme';

export const lightTheme = createTheme({
  colorMode: 'light' as ColorMode,
  tokens: baseTokens,
});

export const darkTheme = createTheme({
  colorMode: 'dark' as ColorMode,
  tokens: baseTokens,
});
