import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { useThemeStore } from '@/store/themeStore';

describe('Theme Hydration', () => {
  beforeEach(() => {
    // Reset theme store and clear localStorage
    useThemeStore.getState().reset();
    localStorage.clear();

    // Reset matchMedia mock
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('should apply initial theme classes during SSR', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('theme-homy', 'theme-light');
  });

  it('should hydrate theme from localStorage', () => {
    // Setup persisted theme
    localStorage.setItem(
      'theme-store',
      JSON.stringify({
        currentBrand: 'Neuro',
        colorMode: 'dark',
        systemPreference: false,
      })
    );

    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('theme-neuro', 'theme-dark');
  });

  it('should respect system color scheme when system preference is enabled', () => {
    // Mock system dark mode
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Enable system preference
    useThemeStore.getState().setSystemPreference(true);

    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('should handle theme changes after hydration', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Change theme after initial render
    useThemeStore.getState().setBrand('Lab');
    useThemeStore.getState().setColorMode('dark');

    expect(container.firstChild).toHaveClass('theme-lab', 'theme-dark');
  });

  it('should not have class mismatch during hydration', () => {
    // This test ensures there's no flash of incorrect theme
    const consoleSpy = jest.spyOn(console, 'error');

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Warning: Prop `className` did not match')
    );

    consoleSpy.mockRestore();
  });
});
