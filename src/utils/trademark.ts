import {
  defaultTrademarkKit,
  type TrademarkVisualKit,
} from '../../promptpacks/trademark-visual-kit.prompt';

export function applyTrademarkStyle(
  element: HTMLElement,
  options?: Partial<TrademarkVisualKit['visualIdentity']>
): void {
  const visualStyle = {
    ...defaultTrademarkKit.visualIdentity,
    ...options,
  };

  element.style.setProperty('--homy-primary', visualStyle.colors.primary);
  element.style.setProperty('--homy-success', visualStyle.colors.success);
  element.style.setProperty('--homy-focus', visualStyle.colors.focus);
  element.style.setProperty('--homy-warning', visualStyle.colors.warning);

  // Apply typography
  if (element.tagName === 'H1' || element.tagName === 'H2') {
    element.style.fontFamily = visualStyle.typography.title.split('/')[0];
    element.style.fontWeight = 'bold';
  } else if (element.tagName === 'H3' || element.tagName === 'H4') {
    element.style.fontFamily = visualStyle.typography.subtitle.split('/')[0];
    element.style.fontWeight = '500';
  } else {
    element.style.fontFamily = visualStyle.typography.body.split('/')[0];
    element.style.fontWeight = 'normal';
  }

  // Apply spacing
  element.style.padding = visualStyle.spacing.padding;
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
