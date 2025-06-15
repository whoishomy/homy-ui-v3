import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';

interface ThemeState {
  brand: Brand;
  colorMode: ColorMode;
  isSystemPreference: boolean;
  setBrand: (brand: Brand) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleSystemPreference: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      brand: 'homy',
      colorMode: 'light',
      isSystemPreference: true,
      setBrand: (brand) => set({ brand }),
      setColorMode: (colorMode) => set({ colorMode, isSystemPreference: false }),
      toggleSystemPreference: () =>
        set((state) => ({
          isSystemPreference: !state.isSystemPreference,
          colorMode: state.isSystemPreference
            ? state.colorMode
            : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
        })),
    }),
    {
      name: 'homy-theme-storage',
      partialize: (state) => ({
        brand: state.brand,
        colorMode: state.colorMode,
        isSystemPreference: state.isSystemPreference,
      }),
    }
  )
);
