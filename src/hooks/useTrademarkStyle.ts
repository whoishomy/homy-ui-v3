import { useEffect, useRef } from 'react';
import type { TrademarkVisualKit } from '../../promptpacks/trademark-visual-kit.prompt';
import { applyTrademarkStyle } from '../utils/trademark';

export function useTrademarkStyle<T extends HTMLElement>(
  options?: Partial<TrademarkVisualKit['visualIdentity']>
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (elementRef.current) {
      applyTrademarkStyle(elementRef.current, options);
    }
  }, [options]);

  return elementRef;
}

// Usage example:
/*
function MyComponent() {
  const containerRef = useTrademarkStyle<HTMLDivElement>({
    colors: {
      primary: '#custom-color',
    },
  });

  return (
    <div ref={containerRef}>
      <h1>HOMY™ Component</h1>
    </div>
  );
}
*/
