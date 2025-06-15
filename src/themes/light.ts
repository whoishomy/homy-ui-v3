import type { TrademarkTheme } from '@/types/TrademarkTheme';

export const lightTheme: TrademarkTheme = {
  colorMode: 'light',
  tokens: {
    colors: {
      primary: '#0070f3',
      secondary: '#7928ca',
      success: '#0070f3',
      error: '#ff0000',
      warning: '#f5a623',
      info: '#0070f3',
      surface: '#ffffff',
      background: '#f5f5f5',
      border: 'rgba(0, 0, 0, 0.1)',
      text: {
        primary: '#000000',
        secondary: '#666666',
        light: '#ffffff',
        dark: '#000000',
      },
    },
    spacing: {
      scale: {
        xs: '0.25rem',
        sm: '0.5rem',
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
      md: '0.5rem',
      lg: '1rem',
      xl: '1.5rem',
      pill: '9999px',
      circle: '50%',
    },
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
        mono: 'Menlo, Monaco, Consolas, monospace',
      },
    },
  },
  kits: {
    homy: {
      visualIdentity: {
        colors: {
          primary: '#0070f3',
        },
        typography: {
          title: '2rem',
          subtitle: '1.5rem',
          body: '1rem',
          fontSize: {
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          },
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
        },
      },
    },
    neuro: {
      visualIdentity: {
        colors: {
          primary: '#7928ca',
        },
        typography: {
          title: '2rem',
          subtitle: '1.5rem',
          body: '1rem',
          fontSize: {
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          },
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
        },
      },
    },
    lab: {
      visualIdentity: {
        colors: {
          primary: '#f5a623',
        },
        typography: {
          title: '2rem',
          subtitle: '1.5rem',
          body: '1rem',
          fontSize: {
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          },
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
        },
      },
    },
  },
};
