import type { Theme } from '@/types/TrademarkTheme';

const baseTokens = {
  spacing: {
    scale: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    layout: {
      container: '1200px',
      gutter: '2rem',
    },
  },
  borders: {
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const themes: Record<string, Theme> = {
  HOMY: {
    name: 'HOMY',
    tokens: {
      ...baseTokens,
      colors: {
        primary: '#10B981',
        secondary: '#6366F1',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        scale: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
        },
        weight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        letterSpacing: {
          tight: '-0.025em',
          normal: '0',
          wide: '0.025em',
        },
        lineHeight: {
          none: 1,
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
    },
    darkTokens: {
      colors: {
        background: '#111827',
        text: '#F9FAFB',
        border: '#374151',
      },
    },
  },
  Neuro: {
    name: 'Neuro',
    tokens: {
      ...baseTokens,
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      typography: {
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        scale: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.25rem',
          xl: '1.5rem',
          '2xl': '2rem',
        },
        weight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        letterSpacing: {
          tight: '-0.05em',
          normal: '-0.025em',
          wide: '0',
        },
        lineHeight: {
          none: 1,
          tight: 1.2,
          normal: 1.4,
          relaxed: 1.6,
        },
      },
    },
    darkTokens: {
      colors: {
        background: '#0F172A',
        text: '#F8FAFC',
        border: '#334155',
      },
    },
  },
  Lab: {
    name: 'Lab',
    tokens: {
      ...baseTokens,
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      typography: {
        fontFamily: 'JetBrains Mono, monospace',
        scale: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
        },
        weight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        letterSpacing: {
          tight: '0',
          normal: '0.025em',
          wide: '0.05em',
        },
        lineHeight: {
          none: 1,
          tight: 1.3,
          normal: 1.6,
          relaxed: 1.8,
        },
      },
    },
    darkTokens: {
      colors: {
        background: '#0F172A',
        text: '#F8FAFC',
        border: '#334155',
      },
    },
  },
};
