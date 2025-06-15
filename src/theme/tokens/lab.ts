import type { ThemeTokens } from '@/types/TrademarkTheme';
import { getFontFamilyString } from '@/utils/fontLoader';

export const labTokens: ThemeTokens = {
  colors: {
    // Brand Colors - Scientific, Analytical palette
    primary: '#0EA5E9',
    secondary: '#8B5CF6',
    accent: '#EC4899',

    // UI Colors
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },

    // State Colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Interactive States
    hover: '#0284C7',
    focus: '#0EA5E9',
    active: '#0369A1',
    disabled: '#E2E8F0',
  },

  typography: {
    fontFamily: getFontFamilyString('lab'),
    scale: {
      h1: '2rem', // 32px
      h2: '1.5rem', // 24px
      h3: '1.25rem', // 20px
      subtitle: '1.125rem', // 18px
      body: '0.875rem', // 14px
      caption: '0.75rem', // 12px
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    letterSpacing: {
      tight: '0',
      normal: '0.01em',
      wide: '0.03em',
    },
    lineHeight: {
      compact: 1.3,
      normal: 1.7,
      relaxed: 2,
    },
  },

  spacing: {
    scale: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2.5rem', // 40px
    },
    layout: {
      gutter: '1rem',
      container: '40px',
      maxWidth: '1280px',
    },
  },

  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },

  breakpoints: {
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },
};
