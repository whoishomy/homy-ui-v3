import { ThemeTokens } from './tokens';

export type ColorMode = 'light' | 'dark';

export interface Theme {
  colorMode: ColorMode;
  tokens: ThemeTokens;
}

export type CreateThemeConfig = {
  colorMode: ColorMode;
  tokens: ThemeTokens;
};
