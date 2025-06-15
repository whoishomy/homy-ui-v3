import { useMemo } from 'react';
import { useTheme } from './useTheme';
import type { ColorPreset, ColorVariant, ColorIntensity } from '@/types/ColorPreset';

type ColorClassConfig = {
  preset: ColorPreset;
  variant?: ColorVariant;
  intensity?: ColorIntensity;
  isOutlined?: boolean;
  isGhost?: boolean;
  isInteractive?: boolean;
};

const intensityMap: Record<ColorIntensity, number> = {
  light: 100,
  medium: 500,
  bold: 700,
  contrast: 900,
};

const variantMap: Record<ColorVariant, string> = {
  solid: 'solid',
  subtle: 'subtle',
  muted: 'muted',
};

export function useColorPresetClass(config: ColorClassConfig): string {
  const {
    preset,
    variant = 'solid',
    intensity = 'medium',
    isOutlined = false,
    isGhost = false,
    isInteractive = false,
  } = config;

  const { isDark, getTokens } = useTheme();
  const tokens = getTokens();

  return useMemo(() => {
    const baseClass = `color-${preset}`;
    const variantClass = `${baseClass}--${variantMap[variant]}`;
    const intensityClass = `${variantClass}-${intensityMap[intensity]}`;

    const classes = [baseClass, variantClass, intensityClass];

    if (isOutlined) {
      classes.push(`${baseClass}--outlined`);
    }

    if (isGhost) {
      classes.push(`${baseClass}--ghost`);
    }

    if (isInteractive) {
      classes.push(`${baseClass}--interactive`);
    }

    if (isDark) {
      classes.push(`${baseClass}--dark`);
    }

    return classes.join(' ');
  }, [preset, variant, intensity, isOutlined, isGhost, isInteractive, isDark]);
}

// CSS Variables Generated:
/*
--color-{preset}: {color};
--color-{preset}-{intensity}: {color};
--color-{preset}-contrast: {color};
--color-{preset}-bg: {color};
--color-{preset}-border: {color};
--color-{preset}-hover: {color};
--color-{preset}-active: {color};
--color-{preset}-focus: {color};

// Variants
.color-{preset}--solid {
  background: var(--color-{preset}-bg);
  color: var(--color-{preset}-contrast);
}

.color-{preset}--subtle {
  background: var(--color-{preset}-bg-subtle);
  color: var(--color-{preset});
}

.color-{preset}--muted {
  background: transparent;
  color: var(--color-{preset});
}

// Modifiers
.color-{preset}--outlined {
  border: 1px solid var(--color-{preset}-border);
}

.color-{preset}--ghost {
  background: transparent;
  color: var(--color-{preset});
}

.color-{preset}--interactive {
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: var(--color-{preset}-hover);
  }

  &:active {
    background: var(--color-{preset}-active);
  }

  &:focus {
    outline: 2px solid var(--color-{preset}-focus);
    outline-offset: 2px;
  }
}

// Dark Mode
.color-{preset}--dark {
  --color-{preset}: {darkColor};
  --color-{preset}-bg: {darkBgColor};
  // ... other dark mode variables
}
*/
