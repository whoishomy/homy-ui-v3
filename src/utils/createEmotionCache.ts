import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({
    key: 'homy-trademark',
    // Prefix for class names
    prepend: true,
    // This sets up SSR by creating a new cache for each request
    key: typeof window === 'undefined' ? 'ssr' : 'css',
  });
}
