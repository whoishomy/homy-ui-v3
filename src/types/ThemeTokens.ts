import type { ColorPresetToken } from './ColorPreset';

export interface ThemeTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface ColorTokens {
  text: {
    light: string;
    dark: string;
  };
  primary: string;
  presets: Record<string, ColorPresetToken>;
}

export interface TypographyTokens {
  scale: Record<string, string>;
  weight: Record<string, string>;
  family: Record<string, string>;
  fontFamily: {
    sans: string;
    mono: string;
    display: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface SpacingTokens {
  scale: Record<string, string>;
}

export interface BorderRadiusTokens extends Record<string, string> {}
