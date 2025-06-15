import {
  defaultTrademarkKit,
  type TrademarkVisualKit,
} from '../../promptpacks/trademark-visual-kit.prompt';

export function applyTrademarkStyle<T extends HTMLElement>(
  element: T,
  options?: Partial<TrademarkVisualKit['visualIdentity']>
): React.CSSProperties {
  const style: React.CSSProperties = {
    // Default trademark styles
    fontFamily: '"Inter", sans-serif',
    color: options?.colors?.primary || '#000000',
    // Add any other default styles here
  };

  // Apply custom styles based on options
  if (options?.typography?.fontSize) {
    style.fontSize = options.typography.fontSize;
  }

  if (options?.spacing?.padding) {
    style.padding = options.spacing.padding;
  }

  // Apply styles to the element
  Object.assign(element.style, style);

  return style;
}

export function getTrademarkName(componentName: string): string {
  return `${defaultTrademarkKit.brandName} ${componentName}`;
}

export function validateAssetPath(path: string): boolean {
  const { assetStructure } = defaultTrademarkKit;

  // Check if the path matches any of our defined asset patterns
  return [
    ...assetStructure.logos,
    ...assetStructure.screenshots,
    ...assetStructure.icons,
    ...assetStructure.backgrounds,
  ].some((pattern) => {
    if (pattern.endsWith('/*')) {
      const directory = pattern.slice(0, -2);
      return path.startsWith(directory);
    }
    return path === pattern;
  });
}

export function getExportSettings<T extends 'figma' | 'screenshots'>(
  type: T
): TrademarkVisualKit['exportSettings'][T] {
  return defaultTrademarkKit.exportSettings[type] as TrademarkVisualKit['exportSettings'][T];
}

export const TRADEMARK_CLASSES = defaultTrademarkKit.trademarkStatus.classes;
export const TRADEMARK_FILING_DATE = defaultTrademarkKit.trademarkStatus.date;
