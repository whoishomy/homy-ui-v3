import type { TrademarkVisualKit, Breakpoint, ResponsiveValue } from '../types/TrademarkVisualKit';

function getResponsiveValue<T>(value: ResponsiveValue<T>, breakpoint: Breakpoint): T | undefined {
  if (typeof value === 'object' && value !== null) {
    return value[breakpoint] as T;
  }
  return value as T;
}

function getCurrentBreakpoint(): Breakpoint {
  const width = window.innerWidth;
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  return 'sm';
}

function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTrademarkStyle<T extends HTMLElement>(
  element: T,
  options?: TrademarkVisualKit
): React.CSSProperties {
  const breakpoint = getCurrentBreakpoint();
  const isDark = isDarkMode();

  const style: React.CSSProperties = {
    fontFamily: '"Inter", sans-serif',
  };

  if (options?.visualIdentity.colors) {
    const colors = options.visualIdentity.colors;
    if (isDark && colors.dark) {
      style.color = colors.dark.primary;
    } else {
      style.color = colors.primary;
    }
  }

  if (options?.visualIdentity.typography) {
    const typography = options.visualIdentity.typography;
    const fontSize = getResponsiveValue(typography.fontSize!, breakpoint);
    if (fontSize) style.fontSize = fontSize;
    if (typography.letterSpacing) style.letterSpacing = typography.letterSpacing;
    if (typography.lineHeight) style.lineHeight = typography.lineHeight;
  }

  if (options?.visualIdentity.spacing) {
    const spacing = options.visualIdentity.spacing;
    const padding = getResponsiveValue(spacing.padding!, breakpoint);
    if (padding) style.padding = padding;
    if (spacing.gap) style.gap = spacing.gap;
  }

  // Apply styles to the element
  Object.assign(element.style, style);

  return style;
}
