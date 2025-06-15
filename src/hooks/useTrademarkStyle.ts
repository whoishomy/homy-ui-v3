import { useEffect, useRef } from 'react';
import type { TrademarkVisualKit } from '../types/TrademarkVisualKit';
import { applyTrademarkStyle } from '../utils/applyTrademarkStyle';
import { useTrademarkTheme } from '../context/TrademarkThemeContext';

export function useTrademarkStyle<T extends HTMLElement>(options?: Partial<TrademarkVisualKit>) {
  const elementRef = useRef<T>(null);
  const { theme, currentBrand } = useTrademarkTheme();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Get brand-specific kit
    const brandKit = theme.kits[currentBrand];

    // Merge options with brand kit
    const mergedOptions = {
      visualIdentity: {
        ...brandKit.visualIdentity,
        ...options?.visualIdentity,
      },
    };

    // Apply styles
    const style = applyTrademarkStyle(element, mergedOptions);

    // Handle window resize for responsive styles
    const handleResize = () => {
      const updatedStyle = applyTrademarkStyle(element, mergedOptions);
      Object.assign(element.style, updatedStyle);
    };

    // Handle color scheme changes
    const handleColorSchemeChange = () => {
      const updatedStyle = applyTrademarkStyle(element, mergedOptions);
      Object.assign(element.style, updatedStyle);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleColorSchemeChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleColorSchemeChange);
    };
  }, [options, theme, currentBrand]);

  return elementRef;
}

// Usage example:
/*
function MyComponent() {
  const { elementRef, trademarkStyle } = useTrademarkStyle<HTMLDivElement>({
    colors: {
      primary: '#custom-color',
    },
  });

  return (
    <div ref={elementRef} style={trademarkStyle}>
      <h1>HOMY™ Component</h1>
    </div>
  );
}
*/
