import { Brand } from '@/types/TrademarkVisualKit';

interface FontDefinition {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  path: string;
}

const BRAND_FONTS: Record<Brand, FontDefinition[]> = {
  homy: [
    { family: 'Inter', weight: 400, style: 'normal', path: '/fonts/Inter-Regular.woff2' },
    { family: 'Inter', weight: 500, style: 'normal', path: '/fonts/Inter-Medium.woff2' },
    { family: 'Inter', weight: 700, style: 'normal', path: '/fonts/Inter-Bold.woff2' },
  ],
  neuro: [
    {
      family: 'Space Grotesk',
      weight: 400,
      style: 'normal',
      path: '/fonts/SpaceGrotesk-Regular.woff2',
    },
    {
      family: 'Space Grotesk',
      weight: 500,
      style: 'normal',
      path: '/fonts/SpaceGrotesk-Medium.woff2',
    },
    {
      family: 'Space Grotesk',
      weight: 700,
      style: 'normal',
      path: '/fonts/SpaceGrotesk-Bold.woff2',
    },
  ],
  lab: [
    {
      family: 'JetBrains Mono',
      weight: 400,
      style: 'normal',
      path: '/fonts/JetBrainsMono-Regular.woff2',
    },
    {
      family: 'JetBrains Mono',
      weight: 500,
      style: 'normal',
      path: '/fonts/JetBrainsMono-Medium.woff2',
    },
    {
      family: 'JetBrains Mono',
      weight: 700,
      style: 'normal',
      path: '/fonts/JetBrainsMono-Bold.woff2',
    },
  ],
};

export function getFontFamilyString(brand: Brand): string {
  const primaryFont = BRAND_FONTS[brand][0].family;
  return `"${primaryFont}", system-ui, -apple-system, sans-serif`;
}

export function getFontPreloadTags(brand: Brand): string {
  return BRAND_FONTS[brand]
    .map(
      (font) => `<link 
  rel="preload" 
  href="${font.path}" 
  as="font" 
  type="font/woff2" 
  crossorigin="anonymous" 
/>`
    )
    .join('\n');
}

export function getFontFaceDeclarations(brand: Brand): string {
  return BRAND_FONTS[brand]
    .map(
      (font) => `@font-face {
  font-family: "${font.family}";
  font-weight: ${font.weight};
  font-style: ${font.style};
  src: url("${font.path}") format("woff2");
  font-display: swap;
}`
    )
    .join('\n\n');
}

// Usage example:
/*
// In _document.tsx
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {brands.map(brand => (
    <Fragment key={brand}>
      {getFontPreloadTags(brand)}
    </Fragment>
  ))}
</head>

// In global.css
:root {
  ${brands.map(brand => getFontFaceDeclarations(brand)).join('\n\n')}
}
*/
