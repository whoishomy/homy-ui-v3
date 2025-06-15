import type { ThemeTokens } from '@/types/TrademarkTheme';

const baseTokens: Omit<ThemeTokens, 'colors'> = {
  typography: {
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    family: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  spacing: {
    scale: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    pill: '9999px',
    circle: '50%',
  },
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const lightTheme: ThemeTokens = {
  ...baseTokens,
  colors: {
    primary: '#0066FF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    focus: '#0066FF',
    disabled: '#E5E7EB',
    hover: '#F3F4F6',
    surface: '#FFFFFF',
    background: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      light: '#9CA3AF',
      dark: '#1F2937',
    },
  },
};

export const darkTheme: ThemeTokens = {
  ...baseTokens,
  colors: {
    primary: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    focus: '#60A5FA',
    disabled: '#374151',
    hover: '#1F2937',
    surface: '#111827',
    background: '#030712',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      light: '#6B7280',
      dark: '#E5E7EB',
    },
  },
};
