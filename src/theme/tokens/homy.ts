import type { ThemeTokens } from '@/types/TrademarkTheme';
import { getFontFamilyString } from '@/utils/fontLoader';

export const homyTokens: ThemeTokens = {
  colors: {
    // Brand Colors
    primary: '#1A866D',
    secondary: '#5856D6',
    accent: '#FF9500',

    // UI Colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#666666',
    },

    // State Colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',

    // Interactive States
    hover: '#000000',
    focus: '#5856D6',
    active: '#20B491',
    disabled: '#CCCCCC',
  },

  typography: {
    fontFamily: getFontFamilyString('homy'),
    scale: {
      h1: '2rem', // 32px
      h2: '1.5rem', // 24px
      h3: '1.25rem', // 20px
      subtitle: '1.125rem', // 18px
      body: '1rem', // 16px
      caption: '0.875rem', // 14px
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },
    lineHeight: {
      compact: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  spacing: {
    scale: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    layout: {
      gutter: '1rem',
      container: '48px',
      maxWidth: '1200px',
    },
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },

  breakpoints: {
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },
};
