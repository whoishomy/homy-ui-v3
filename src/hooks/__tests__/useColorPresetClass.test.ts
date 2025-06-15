import { renderHook } from '@testing-library/react';
import { useColorPresetClass } from '../useColorPresetClass';
import { useTheme } from '../useTheme';

// Mock useTheme hook
jest.mock('../useTheme', () => ({
  useTheme: jest.fn(),
}));

describe('useColorPresetClass', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockImplementation(() => ({
      isDark: false,
      getTokens: () => ({}),
    }));
  });

  it('returns base class with default options', () => {
    const { result } = renderHook(() => useColorPresetClass({ preset: 'primary' }));

    expect(result.current).toBe('color-primary color-primary--solid color-primary--solid-500');
  });

  it('includes variant class', () => {
    const { result } = renderHook(() =>
      useColorPresetClass({ preset: 'success', variant: 'subtle' })
    );

    expect(result.current).toContain('color-success--subtle');
  });

  it('includes intensity class', () => {
    const { result } = renderHook(() =>
      useColorPresetClass({ preset: 'warning', intensity: 'bold' })
    );

    expect(result.current).toContain('solid-700');
  });

  it('includes outlined modifier', () => {
    const { result } = renderHook(() => useColorPresetClass({ preset: 'error', isOutlined: true }));

    expect(result.current).toContain('color-error--outlined');
  });

  it('includes ghost modifier', () => {
    const { result } = renderHook(() => useColorPresetClass({ preset: 'info', isGhost: true }));

    expect(result.current).toContain('color-info--ghost');
  });

  it('includes interactive modifier', () => {
    const { result } = renderHook(() =>
      useColorPresetClass({ preset: 'secondary', isInteractive: true })
    );

    expect(result.current).toContain('color-secondary--interactive');
  });

  it('includes dark mode class when isDark is true', () => {
    (useTheme as jest.Mock).mockImplementation(() => ({
      isDark: true,
      getTokens: () => ({}),
    }));

    const { result } = renderHook(() => useColorPresetClass({ preset: 'neutral' }));

    expect(result.current).toContain('color-neutral--dark');
  });

  it('combines all modifiers correctly', () => {
    const { result } = renderHook(() =>
      useColorPresetClass({
        preset: 'primary',
        variant: 'subtle',
        intensity: 'light',
        isOutlined: true,
        isGhost: true,
        isInteractive: true,
      })
    );

    const classes = result.current.split(' ');
    expect(classes).toContain('color-primary');
    expect(classes).toContain('color-primary--subtle');
    expect(classes).toContain('color-primary--subtle-100');
    expect(classes).toContain('color-primary--outlined');
    expect(classes).toContain('color-primary--ghost');
    expect(classes).toContain('color-primary--interactive');
  });

  it('memoizes output for same inputs', () => {
    const { result, rerender } = renderHook(() => useColorPresetClass({ preset: 'primary' }));

    const firstResult = result.current;
    rerender();
    expect(result.current).toBe(firstResult);
  });

  it('updates output when inputs change', () => {
    const { result, rerender } = renderHook((props) => useColorPresetClass(props), {
      initialProps: { preset: 'primary' },
    });

    const firstResult = result.current;
    rerender({ preset: 'secondary' });
    expect(result.current).not.toBe(firstResult);
  });
});
