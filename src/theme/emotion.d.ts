import '@emotion/react';
import type { TrademarkTheme } from '@/types/TrademarkTheme';

declare module '@emotion/react' {
  export interface Theme extends TrademarkTheme {
    tokens: TrademarkTheme['tokens'];
    colorMode: TrademarkTheme['colorMode'];
    breakpoints: TrademarkTheme['breakpoints'];
  }
}
