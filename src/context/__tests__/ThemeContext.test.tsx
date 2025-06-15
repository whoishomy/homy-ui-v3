import React from 'react';
import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock matchMedia
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

// Test component that uses theme context
function TestComponent() {
  const { brand, colorMode, isDark, isSystemPreference } = useTheme();
  return (
    <div data-testid="test-component">
      <span data-testid="brand">{brand}</span>
      <span data-testid="color-mode">{colorMode}</span>
      <span data-testid="is-dark">{isDark.toString()}</span>
      <span data-testid="is-system">{isSystemPreference.toString()}</span>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('provides default theme values', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('brand')).toHaveTextContent('homy');
    expect(getByTestId('color-mode')).toHaveTextContent('light');
    expect(getByTestId('is-dark')).toHaveTextContent('false');
    expect(getByTestId('is-system')).toHaveTextContent('false');
  });

  it('accepts initial theme values', () => {
    const { getByTestId } = render(
      <ThemeProvider initialBrand="neuro" initialColorMode="dark" initialSystemPreference={true}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('brand')).toHaveTextContent('neuro');
    expect(getByTestId('color-mode')).toHaveTextContent('dark');
    expect(getByTestId('is-dark')).toHaveTextContent('true');
    expect(getByTestId('is-system')).toHaveTextContent('true');
  });

  it('updates theme values through context', () => {
    const TestUpdater = () => {
      const { setBrand, setColorMode } = useTheme();
      return (
        <div>
          <button onClick={() => setBrand('lab')}>Set Brand</button>
          <button onClick={() => setColorMode('dark')}>Set Mode</button>
        </div>
      );
    };

    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <TestUpdater />
      </ThemeProvider>
    );

    act(() => {
      getByText('Set Brand').click();
    });
    expect(getByTestId('brand')).toHaveTextContent('lab');

    act(() => {
      getByText('Set Mode').click();
    });
    expect(getByTestId('color-mode')).toHaveTextContent('dark');
    expect(getByTestId('is-dark')).toHaveTextContent('true');
  });

  it('handles system color scheme changes', () => {
    // Mock matchMedia to initially return light mode
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((_, handler) => {
        // Store the handler to trigger it later
        (window.matchMedia as jest.Mock).mockImplementation((q) => ({
          matches: true, // Now returns dark mode
          media: q,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));
        handler({ matches: true });
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { getByTestId } = render(
      <ThemeProvider initialSystemPreference={true}>
        <TestComponent />
      </ThemeProvider>
    );

    // Should initially be in light mode
    expect(getByTestId('color-mode')).toHaveTextContent('light');

    // Simulate system color scheme change to dark
    act(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {});
    });

    // Should now be in dark mode
    expect(getByTestId('color-mode')).toHaveTextContent('dark');
    expect(getByTestId('is-dark')).toHaveTextContent('true');
  });

  it('throws error when useTheme is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('memoizes theme values', () => {
    const renders: any[] = [];

    const MemoTest = () => {
      const theme = useTheme();
      renders.push(theme);
      return null;
    };

    const { rerender } = render(
      <ThemeProvider>
        <MemoTest />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider>
        <MemoTest />
      </ThemeProvider>
    );

    // Theme object should be referentially stable
    expect(renders[0]).toBe(renders[1]);
  });
});
