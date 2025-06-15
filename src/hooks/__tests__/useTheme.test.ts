import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import { useThemeStore } from '@/store/themeStore';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';

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

describe('useTheme', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useThemeStore.setState({
        brand: 'homy' as Brand,
        colorMode: 'light' as ColorMode,
        isSystemPreference: false,
      });
    });
  });

  it('returns current theme state', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.currentBrand).toBe('homy');
    expect(result.current.colorMode).toBe('light');
    expect(result.current.systemPreference).toBe(false);
    expect(result.current.isDark).toBe(false);
    expect(result.current.isSystemPreferred).toBe(false);
  });

  it('changes brand correctly', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('neuro');
    });

    expect(result.current.currentBrand).toBe('neuro');
    expect(result.current.getVisualKit()).toBe(result.current.theme.kits.neuro);
  });

  it('toggles color mode', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleColorMode();
    });

    expect(result.current.colorMode).toBe('dark');
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggleColorMode();
    });

    expect(result.current.colorMode).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('handles system preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleSystemPreference();
    });

    expect(result.current.systemPreference).toBe(true);
    expect(result.current.isSystemPreferred).toBe(true);
  });

  it('returns correct tokens', () => {
    const { result } = renderHook(() => useTheme());
    const tokens = result.current.getTokens();

    expect(tokens).toBeDefined();
    expect(tokens).toBe(result.current.theme.tokens);
  });

  it('returns correct visual kit for specified brand', () => {
    const { result } = renderHook(() => useTheme());
    const homyKit = result.current.getVisualKit('homy');
    const neuroKit = result.current.getVisualKit('neuro');

    expect(homyKit).toBeDefined();
    expect(neuroKit).toBeDefined();
    expect(homyKit).toBe(result.current.theme.kits.homy);
    expect(neuroKit).toBe(result.current.theme.kits.neuro);
  });

  it('applies dark mode tokens correctly', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setColorMode('dark');
    });

    const tokens = result.current.getTokens();
    expect(tokens).toMatchObject(result.current.theme.tokens);
    expect(result.current.isDark).toBe(true);
  });

  it('handles system color scheme changes', () => {
    const { result } = renderHook(() => useTheme());

    // Mock system dark mode
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    act(() => {
      result.current.toggleSystemPreference();
    });

    expect(result.current.colorMode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.isSystemPreferred).toBe(true);
  });
});
