import type { ThemeTokens } from '@/types/TrademarkTheme';
import { getFontFamilyString } from '@/utils/fontLoader';

export const neuroTokens: ThemeTokens = {
  colors: {
    // Brand Colors - Futuristic, Tech-focused palette
    primary: '#6E56CF',
    secondary: '#10B981',
    accent: '#F59E0B',

    // UI Colors
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: {
      primary: '#18181B',
      secondary: '#71717A',
    },

    // State Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Interactive States
    hover: '#4F46E5',
    focus: '#6E56CF',
    active: '#4338CA',
    disabled: '#E4E4E7',
  },

  typography: {
    fontFamily: getFontFamilyString('neuro'),
    scale: {
      h1: '2.25rem', // 36px
      h2: '1.75rem', // 28px
      h3: '1.5rem', // 24px
      subtitle: '1.25rem', // 20px
      body: '1rem', // 16px
      caption: '0.875rem', // 14px
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.03em',
      normal: '-0.01em',
      wide: '0.01em',
    },
    lineHeight: {
      compact: 1.2,
      normal: 1.6,
      relaxed: 1.9,
    },
  },

  spacing: {
    scale: {
      xs: '0.375rem', // 6px
      sm: '0.75rem', // 12px
      md: '1.25rem', // 20px
      lg: '2rem', // 32px
      xl: '3rem', // 48px
    },
    layout: {
      gutter: '1.25rem',
      container: '64px',
      maxWidth: '1400px',
    },
  },

  borderRadius: {
    none: '0',
    sm: '6px',
    md: '10px',
    lg: '20px',
    full: '9999px',
  },

  breakpoints: {
    sm: '640px',
    md: '960px',
    lg: '1280px',
    xl: '1600px',
  },
};
