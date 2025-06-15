export type ColorPreset = 'primary' | 'success' | 'warning' | 'error' | 'info';

export type ColorVariant = 'solid' | 'subtle' | 'muted';

export type ColorIntensity = 'light' | 'medium' | 'bold' | 'contrast';

export interface ColorScale {
  100: string; // Light
  300: string; // Lighter
  500: string; // Base
  700: string; // Darker
  900: string; // Darkest
}

export interface ColorMode {
  base: string;
  scale: ColorScale;
  contrast: string;
}

export interface ColorPresetToken {
  base: string;
  scale: ColorScale;
  light: ColorMode;
  dark: ColorMode;
}
