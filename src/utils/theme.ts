import type { Brand, ColorMode } from '@/types/TrademarkTheme';
import type { ThemeTokens } from '@/types/ThemeTokens';
import { generateColorPreset } from './color';

interface ThemeConfig {
  brand: Brand;
  colorMode: ColorMode;
}

export function generateThemeTokens({ brand, colorMode }: ThemeConfig): ThemeTokens {
  return {
    colors: {
      primary: generateColorPreset(
        brand === 'homy' ? '#0066FF' : brand === 'neuro' ? '#6B46C1' : '#00B5D8'
      ),
      secondary: generateColorPreset(
        brand === 'homy' ? '#FF0066' : brand === 'neuro' ? '#805AD5' : '#00A3C4'
      ),
      success: generateColorPreset('#10B981'),
      warning: generateColorPreset('#F59E0B'),
      error: generateColorPreset('#EF4444'),
      info: generateColorPreset('#3B82F6'),
      neutral: generateColorPreset('#6B7280'),
    },
    typography: {
      fontFamily: {
        sans: 'Inter, system-ui, -apple-system, sans-serif',
        mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
        display: 'Cal Sans, Inter, system-ui, sans-serif',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      scale: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
    spacing: {
      scale: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
    },
    borderRadius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
      pill: '999rem',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    breakpoints: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  };
}
