import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { TrademarkThemeProvider } from '@/context/TrademarkThemeContext';
import { FilterProvider } from '@/contexts/FilterContext';
import type { Filters } from '@/contexts/FilterContext';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { TrademarkTheme, ColorMode, Brand } from '@/types/TrademarkTheme';

expect.extend(toHaveNoViolations);

// Mock theme store
jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(),
}));

// Get the mocked useThemeStore
const useThemeStore = jest.requireMock('@/store/themeStore').useThemeStore;

// Mock theme
const mockTheme: TrademarkTheme = {
  colorMode: 'light' as ColorMode,
  tokens: {
    colors: {
      primary: '#1A866D',
      secondary: '#5856D6',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
      info: '#007AFF',
      surface: '#FFFFFF',
      background: '#FFFFFF',
      border: '#E5E5EA',
      text: {
        primary: '#000000',
        secondary: '#666666',
        light: '#FFFFFF',
        dark: '#000000',
      },
    },
    spacing: {
      scale: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
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
        '3xl': '2rem',
      },
      weight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      family: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'monospace',
      },
    },
  },
  kits: {
    homy: {
      visualIdentity: {
        colors: {
          primary: '#1A866D',
        },
        typography: {
          title: 'Inter',
          body: 'Inter',
        },
      },
    },
    neuro: {
      visualIdentity: {
        colors: {
          primary: '#5856D6',
        },
        typography: {
          title: 'Inter',
          body: 'Inter',
        },
      },
    },
    lab: {
      visualIdentity: {
        colors: {
          primary: '#FF9500',
        },
        typography: {
          title: 'Inter',
          body: 'Inter',
        },
      },
    },
  },
};

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialFilters?: Filters;
  initialBrand?: Brand;
  initialColorMode?: ColorMode;
  initialSystemPreference?: boolean;
}

export function AllTheProviders({
  children,
  initialFilters,
  initialBrand = 'homy',
  initialColorMode = 'light',
  initialSystemPreference = false,
}: AllTheProvidersProps) {
  // Mock theme store values
  const mockThemeStore = {
    brand: initialBrand,
    colorMode: initialColorMode,
    isSystemPreference: initialSystemPreference,
    setBrand: jest.fn(),
    setColorMode: jest.fn(),
    toggleSystemPreference: jest.fn(),
  };

  // Set up the mock implementation for this render
  useThemeStore.mockImplementation(() => mockThemeStore);

  return (
    <ThemeProvider theme={mockTheme}>
      <TrademarkThemeProvider>
        <FilterProvider initialFilters={initialFilters}>{children}</FilterProvider>
      </TrademarkThemeProvider>
    </ThemeProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialFilters?: Filters;
  initialBrand?: Brand;
  initialColorMode?: ColorMode;
  initialSystemPreference?: boolean;
}

export function customRender(ui: React.ReactElement, options?: CustomRenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialFilters={options?.initialFilters}
        initialBrand={options?.initialBrand}
        initialColorMode={options?.initialColorMode}
        initialSystemPreference={options?.initialSystemPreference}
      >
        {children}
      </AllTheProviders>
    ),
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Accessibility testing
export async function testAccessibility(container: Element) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

// Viewport testing
export function setViewportSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}

// Dark mode testing
export function toggleDarkMode() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  Object.defineProperty(darkModeMediaQuery, 'matches', {
    writable: true,
    configurable: true,
    value: !darkModeMediaQuery.matches,
  });
  darkModeMediaQuery.dispatchEvent(new Event('change'));
}
