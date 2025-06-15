import React from 'react';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';

export function TrademarkExample() {
  const { elementRef, trademarkStyle } = useTrademarkStyle<HTMLDivElement>({
    colors: {
      primary: '#007AFF',
    },
    typography: {
      fontSize: '18px',
    },
    spacing: {
      padding: '2rem',
    },
  });

  return (
    <div ref={elementRef} style={trademarkStyle}>
      <h1>HOMY™ Component</h1>
      <p>This component uses the trademark styling system.</p>
    </div>
  );
}
