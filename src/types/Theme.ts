import type { Variants } from 'framer-motion';

export interface ThemeTokens {
  colors: {
    primary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    focus: string;
    disabled: string;
    hover: string;
    surface: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
      dark: string;
    };
  };
  spacing: {
    scale: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  typography: {
    scale: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    weight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    family: {
      sans: string;
      mono: string;
    };
  };
  borderRadius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
    none: string;
  };
  zIndex: {
    hide: number;
    auto: number;
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    overlay: number;
    modal: number;
    popover: number;
    toast: number;
  };
  transition: {
    fast: string;
    base: string;
    slow: string;
  };
  duration: {
    instant: string;
    fast: string;
    base: string;
    slow: string;
    slower: string;
  };
  motion: {
    presets: Record<string, Variants>;
  };
}

export interface Theme {
  colorMode: 'light' | 'dark';
  tokens: ThemeTokens;
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}
