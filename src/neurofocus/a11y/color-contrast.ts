import { EmotionalResponse } from '../core/types';

interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  contrast: {
    normal: string;
    high: string;
  };
}

// Our emotional color palettes are designed to be WCAG 2.1 AA compliant
// with a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
export const emotionalColorPalettes: Record<EmotionalResponse['type'], ColorPalette> = {
  exploring: {
    primary: '#4A90E2', // Soft blue - Curiosity
    secondary: '#81C3D7',
    background: '#F5F9FF',
    text: '#2C3E50', // Dark blue-grey for 7:1 contrast
    contrast: {
      normal: '#1B2631', // Darker for normal text
      high: '#000000', // Black for high contrast needs
    },
  },
  frustrated: {
    primary: '#E57373', // Soft red - Gentle on eyes
    secondary: '#FFB74D',
    background: '#FFF5F5',
    text: '#4A4A4A',
    contrast: {
      normal: '#2D2D2D',
      high: '#000000',
    },
  },
  overwhelmed: {
    primary: '#9575CD', // Calming purple
    secondary: '#B39DDB',
    background: '#F8F5FF',
    text: '#3A3A3A',
    contrast: {
      normal: '#2D2D2D',
      high: '#000000',
    },
  },
  discouraged: {
    primary: '#FFB74D', // Warm orange - Encouraging
    secondary: '#FFF176',
    background: '#FFFBF5',
    text: '#4A4A4A',
    contrast: {
      normal: '#2D2D2D',
      high: '#000000',
    },
  },
  tired: {
    primary: '#90A4AE', // Soft grey-blue - Restful
    secondary: '#B0BEC5',
    background: '#F5F7FA',
    text: '#37474F',
    contrast: {
      normal: '#263238',
      high: '#000000',
    },
  },
  proud: {
    primary: '#4CAF50', // Success green
    secondary: '#81C784',
    background: '#F5FFF6',
    text: '#2E7D32',
    contrast: {
      normal: '#1B5E20',
      high: '#000000',
    },
  },
  curious: {
    primary: '#26C6DA', // Bright cyan - Engaging
    secondary: '#4DD0E1',
    background: '#F5FCFF',
    text: '#006064',
    contrast: {
      normal: '#00363A',
      high: '#000000',
    },
  },
  determined: {
    primary: '#5C6BC0', // Strong indigo - Focus
    secondary: '#7986CB',
    background: '#F5F6FF',
    text: '#283593',
    contrast: {
      normal: '#1A237E',
      high: '#000000',
    },
  },
};

/**
 * Calculates the contrast ratio between two colors
 * Following WCAG 2.1 guidelines
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculates the relative luminance of a color
 * Based on WCAG 2.1 specifications
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Gets the appropriate text color based on background
 * Ensures WCAG 2.1 AA compliance (4.5:1 for normal text)
 */
export function getAccessibleTextColor(
  backgroundColor: string,
  emotionalState: EmotionalResponse['type']
): string {
  const palette = emotionalColorPalettes[emotionalState];
  const normalContrast = getContrastRatio(backgroundColor, palette.text);
  const highContrast = getContrastRatio(backgroundColor, palette.contrast.high);

  return normalContrast >= 4.5 ? palette.text : palette.contrast.high;
}
