import { act } from '@testing-library/react';
import { useThemeStore } from '@/store/themeStore';

describe('Theme Store', () => {
  beforeEach(() => {
    // Clear localStorage and reset store between tests
    localStorage.clear();
    act(() => {
      useThemeStore.getState().reset();
    });
  });

  describe('Initial State', () => {
    it('should have default values', () => {
      const state = useThemeStore.getState();
      expect(state.currentBrand).toBe('HOMY');
      expect(state.colorMode).toBe('light');
      expect(state.systemPreference).toBe(false);
    });

    it('should load persisted state from localStorage', () => {
      // Setup persisted state
      localStorage.setItem(
        'theme-store',
        JSON.stringify({
          currentBrand: 'Neuro',
          colorMode: 'dark',
          systemPreference: true,
        })
      );

      // Reinitialize store
      const state = useThemeStore.getState();
      expect(state.currentBrand).toBe('Neuro');
      expect(state.colorMode).toBe('dark');
      expect(state.systemPreference).toBe(true);
    });
  });

  describe('Theme Switching', () => {
    it('should switch brand', () => {
      act(() => {
        useThemeStore.getState().setBrand('Lab');
      });

      const state = useThemeStore.getState();
      expect(state.currentBrand).toBe('Lab');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"currentBrand":"Lab"')
      );
    });

    it('should switch color mode', () => {
      act(() => {
        useThemeStore.getState().setColorMode('dark');
      });

      const state = useThemeStore.getState();
      expect(state.colorMode).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"colorMode":"dark"')
      );
    });

    it('should toggle system preference', () => {
      act(() => {
        useThemeStore.getState().setSystemPreference(true);
      });

      const state = useThemeStore.getState();
      expect(state.systemPreference).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"systemPreference":true')
      );
    });
  });

  describe('Theme Persistence', () => {
    it('should persist state changes to localStorage', () => {
      act(() => {
        const store = useThemeStore.getState();
        store.setBrand('Neuro');
        store.setColorMode('dark');
        store.setSystemPreference(true);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"currentBrand":"Neuro"')
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"colorMode":"dark"')
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-store',
        expect.stringContaining('"systemPreference":true')
      );
    });
  });
});
