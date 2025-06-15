import { z } from 'zod';
import type { TrademarkVisualKit } from './TrademarkVisualKit';
import type { Theme } from '@emotion/react';
import type { BrandName } from './BrandName';

export const brandVariants = ['homy', 'neuro', 'lab'] as const;
export type BrandVariant = (typeof brandVariants)[number];

export type Brand = 'homy' | 'neuro' | 'lab';
export type ColorMode = 'light' | 'dark';
export type ColorPreset = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ColorSystem {
  // Brand Colors
  primary: string;
  secondary: string;
  accent: string;

  // UI Colors
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };

  // State Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Interactive States
  hover: string;
  focus: string;
  active: string;
  disabled: string;
}

export interface Typography {
  fontFamily: string;
  scale: {
    h1: string;
    h2: string;
    h3: string;
    subtitle: string;
    body: string;
    caption: string;
  };
  weight: {
    regular: number;
    medium: number;
    bold: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  lineHeight: {
    compact: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  scale: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  layout: {
    gutter: string;
    container: string;
    maxWidth: string;
  };
}

export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    surface: string;
    background: string;
    border: string;
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
      '3xl': string;
    };
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    pill: string;
    circle: string;
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
}

export interface VisualIdentity {
  colors: {
    primary: string;
  };
  typography: {
    title?: string;
    subtitle?: string;
    body?: string;
    fontSize?: string | Partial<Record<'sm' | 'md' | 'lg' | 'xl', string>>;
    letterSpacing?: string;
    lineHeight?: string;
  };
  spacing?: {
    padding?: string | Partial<Record<'sm' | 'md' | 'lg' | 'xl', string>>;
    gap?: string;
  };
}

export interface BrandKit {
  visualIdentity: VisualIdentity;
}

export interface TrademarkTheme extends Theme {
  colorMode: 'light' | 'dark';
  currentBrand: BrandName;
  tokens: {
    colors: Record<string, string>;
    typography: {
      scale: Record<string, string>;
      weight: Record<string, string>;
      family: Record<string, string>;
    };
    spacing: {
      scale: Record<string, string>;
    };
    borderRadius: Record<string, string>;
  };
  kits: Record<Brand, BrandKit>;
}

export const trademarkThemeSchema = z.object({
  brand: z.enum(brandVariants),
  kits: z.record(z.enum(brandVariants), z.any()), // TrademarkVisualKit validation handled separately
});

export const defaultTheme: TrademarkTheme = {
  brand: 'homy',
  colorMode: 'light',
  currentBrand: 'homy',
  tokens: {
    colors: {
      primary: '#1A866D',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: {
        primary: '#000000',
        secondary: '#666666',
      },
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      info: '#007AFF',
      hover: '#000000',
      focus: '#5856D6',
      active: '#20B491',
      disabled: '#CCCCCC',
    },
    typography: {
      fontFamily: 'Inter',
      scale: {
        h1: '24px',
        h2: '20px',
        h3: '18px',
        subtitle: '16px',
        body: '14px',
        caption: '12px',
      },
      weight: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0.01em',
        wide: '0.03em',
      },
      lineHeight: {
        compact: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    spacing: {
      scale: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
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
  },
  kits: {
    homy: {
      visualIdentity: {
        colors: {
          primary: '#1A866D',
          success: '#34C759',
          warning: '#FF9500',
          focus: '#5856D6',
          dark: {
            primary: '#20B491',
            success: '#30D158',
            warning: '#FF9F0A',
            focus: '#5E5CE6',
          },
        },
        typography: {
          title: 'Inter/Bold',
          subtitle: 'Inter/Medium',
          body: 'Inter/Regular',
          fontSize: {
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
          },
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
        },
        spacing: {
          padding: {
            sm: '0.75rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
          },
          gap: '1rem',
        },
      },
    },
    neuro: {
      visualIdentity: {
        colors: {
          primary: '#5856D6',
          success: '#34C759',
          warning: '#FF9500',
          focus: '#007AFF',
          dark: {
            primary: '#5E5CE6',
            success: '#30D158',
            warning: '#FF9F0A',
            focus: '#0A84FF',
          },
        },
        typography: {
          title: 'Space Grotesk/Bold',
          subtitle: 'Space Grotesk/Medium',
          body: 'Space Grotesk/Regular',
          fontSize: {
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
          },
          letterSpacing: '0.01em',
          lineHeight: '1.6',
        },
        spacing: {
          padding: {
            sm: '1rem',
            md: '1.5rem',
            lg: '2rem',
            xl: '3rem',
          },
          gap: '1.5rem',
        },
      },
    },
    lab: {
      visualIdentity: {
        colors: {
          primary: '#FF3B30',
          success: '#34C759',
          warning: '#FF9500',
          focus: '#007AFF',
          dark: {
            primary: '#FF453A',
            success: '#30D158',
            warning: '#FF9F0A',
            focus: '#0A84FF',
          },
        },
        typography: {
          title: 'JetBrains Mono/Bold',
          subtitle: 'JetBrains Mono/Medium',
          body: 'JetBrains Mono/Regular',
          fontSize: {
            sm: '12px',
            md: '14px',
            lg: '16px',
            xl: '18px',
          },
          letterSpacing: '0.03em',
          lineHeight: '1.4',
        },
        spacing: {
          padding: {
            sm: '0.5rem',
            md: '0.75rem',
            lg: '1rem',
            xl: '1.5rem',
          },
          gap: '0.75rem',
        },
      },
    },
  },
};
