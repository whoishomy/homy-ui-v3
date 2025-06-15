import { Html, Head, Main, NextScript } from 'next/document';
import { Fragment } from 'react';
import createEmotionCache from '@/utils/createEmotionCache';
import createEmotionServer from '@emotion/server/create-instance';
import { getFontPreloadTags } from '@/utils/fontLoader';

const brands = ['homy', 'neuro', 'lab'] as const;

export default function Document({ emotionStyleTags }: { emotionStyleTags: JSX.Element[] }) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Emotion SSR styles */}
        {emotionStyleTags}
        {/* Font preload tags */}
        {brands.map((brand) => (
          <Fragment key={brand}>
            <div dangerouslySetInnerHTML={{ __html: getFontPreloadTags(brand) }} />
          </Fragment>
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// This gets called on every request
Document.getInitialProps = async (ctx: any) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props: any) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await ctx.defaultGetInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style: any) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
