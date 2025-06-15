import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import { TrademarkThemeProvider } from '@/context/TrademarkThemeContext';

// Client-side cache, shared for the whole session
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <TrademarkThemeProvider>
        <Component {...pageProps} />
      </TrademarkThemeProvider>
    </CacheProvider>
  );
}
