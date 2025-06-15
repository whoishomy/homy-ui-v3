export interface ColorToken {
  light: { base: string; contrast: string };
  dark: { base: string; contrast: string };
  scale: Record<number, string>;
}

export interface ThemeTokens {
  colors: Record<string, ColorToken>;
  container: {
    maxWidth: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  spacing: {
    scale: {
      none: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  text: {
    heading: {
      light: string;
      dark: string;
    };
    body: {
      light: string;
      dark: string;
    };
    muted: {
      light: string;
      dark: string;
    };
  };
  focus: {
    ring: {
      width: string;
      color: {
        light: string;
        dark: string;
      };
    };
    border: {
      width: string;
      color: {
        light: string;
        dark: string;
      };
    };
  };
}

export const baseTokens: ThemeTokens = {
  colors: {
    primary: {
      light: { base: '#0066FF', contrast: '#FFFFFF' },
      dark: { base: '#3385FF', contrast: '#FFFFFF' },
      scale: {
        500: '#0066FF',
        700: '#0052CC',
        900: '#003D99',
      },
    },
    success: {
      light: { base: '#10B981', contrast: '#FFFFFF' },
      dark: { base: '#34D399', contrast: '#FFFFFF' },
      scale: {
        500: '#10B981',
        700: '#059669',
        900: '#047857',
      },
    },
    warning: {
      light: { base: '#F59E0B', contrast: '#FFFFFF' },
      dark: { base: '#FBBF24', contrast: '#1F2937' },
      scale: {
        500: '#F59E0B',
        700: '#D97706',
        900: '#B45309',
      },
    },
    error: {
      light: { base: '#EF4444', contrast: '#FFFFFF' },
      dark: { base: '#F87171', contrast: '#FFFFFF' },
      scale: {
        500: '#EF4444',
        700: '#DC2626',
        900: '#B91C1C',
      },
    },
    info: {
      light: { base: '#3B82F6', contrast: '#FFFFFF' },
      dark: { base: '#60A5FA', contrast: '#FFFFFF' },
      scale: {
        500: '#3B82F6',
        700: '#2563EB',
        900: '#1D4ED8',
      },
    },
  },
  container: {
    maxWidth: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  spacing: {
    scale: {
      none: '0',
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
  },
  text: {
    heading: {
      light: '#111827',
      dark: '#F9FAFB',
    },
    body: {
      light: '#374151',
      dark: '#D1D5DB',
    },
    muted: {
      light: '#6B7280',
      dark: '#9CA3AF',
    },
  },
  focus: {
    ring: {
      width: '2px',
      color: {
        light: 'rgba(59, 130, 246, 0.5)',
        dark: 'rgba(96, 165, 250, 0.5)',
      },
    },
    border: {
      width: '1px',
      color: {
        light: '#3B82F6',
        dark: '#60A5FA',
      },
    },
  },
} as const;
