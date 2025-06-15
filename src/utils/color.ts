import type { ColorPresetToken } from '@/types/ColorPreset';
import { mix, parseToRgb, rgba, shade, tint } from 'polished';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function ensureContrast(backgroundColor: string, textColor: string, targetRatio = 4.5): string {
  let contrast = getContrastRatio(backgroundColor, textColor);
  let adjustedColor = textColor;
  let step = 0.01;
  let attempts = 0;
  const maxAttempts = 100;

  while (contrast < targetRatio && attempts < maxAttempts) {
    adjustedColor =
      getLuminance(backgroundColor) > 128 ? shade(step, textColor) : tint(step, textColor);
    contrast = getContrastRatio(backgroundColor, adjustedColor);
    step += 0.01;
    attempts += 1;
  }

  return adjustedColor;
}

export function generateColorPreset(baseColor: string): ColorPresetToken {
  const scale = {
    100: tint(0.8, baseColor),
    300: tint(0.4, baseColor),
    500: baseColor,
    700: shade(0.3, baseColor),
    900: shade(0.6, baseColor),
  };

  const lightBase = scale[500];
  const darkBase = scale[300];

  const lightContrast = ensureContrast(lightBase, '#FFFFFF');
  const darkContrast = ensureContrast(darkBase, '#1A202C');

  return {
    base: baseColor,
    scale,
    light: {
      base: lightBase,
      scale,
      contrast: lightContrast,
    },
    dark: {
      base: darkBase,
      scale: {
        100: scale[900],
        300: scale[700],
        500: scale[500],
        700: scale[300],
        900: scale[100],
      },
      contrast: darkContrast,
    },
  };
}
