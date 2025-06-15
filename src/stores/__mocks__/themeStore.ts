import { create } from 'zustand';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';

interface ThemeState {
  brand: Brand;
  colorMode: ColorMode;
  useSystemPreference: boolean;
  setBrand: (brand: Brand) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleSystemPreference: () => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  brand: 'default',
  colorMode: 'light',
  useSystemPreference: false,
  setBrand: (brand) => set({ brand }),
  setColorMode: (mode) => set({ colorMode: mode }),
  toggleSystemPreference: () =>
    set((state) => ({ useSystemPreference: !state.useSystemPreference })),
  reset: () => set({ brand: 'default', colorMode: 'light', useSystemPreference: false }),
}));
