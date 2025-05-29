import { z } from 'zod';

export const TrademarkVisualKitSchema = z.object({
  brandName: z.literal('HOMY™'),
  trademarkStatus: z.object({
    filing: z.string(),
    date: z.string(),
    classes: z.array(z.string()),
  }),
  visualIdentity: z.object({
    colors: z.object({
      primary: z.string(),
      success: z.string(),
      focus: z.string(),
      warning: z.string(),
    }),
    typography: z.object({
      title: z.string(),
      subtitle: z.string(),
      body: z.string(),
    }),
    spacing: z.object({
      grid: z.string(),
      padding: z.string(),
    }),
  }),
  assetStructure: z.object({
    logos: z.array(z.string()),
    screenshots: z.array(z.string()),
    icons: z.array(z.string()),
    backgrounds: z.array(z.string()),
  }),
  exportSettings: z.object({
    figma: z.object({
      formats: z.array(z.string()),
      quality: z.string(),
    }),
    screenshots: z.object({
      format: z.string(),
      scale: z.string(),
      shadow: z.string(),
    }),
  }),
});

export const defaultTrademarkKit = {
  brandName: 'HOMY™',
  trademarkStatus: {
    filing: 'EUIPO Application',
    date: '2024-06-06',
    classes: ['44', '9', '42'] as string[],
  },
  visualIdentity: {
    colors: {
      primary: '#4A90E2',
      success: '#4CAF50',
      focus: '#9575CD',
      warning: '#FFB74D',
    },
    typography: {
      title: 'Inter/Bold/48px',
      subtitle: 'Inter/Medium/24px',
      body: 'Inter/Regular/16px',
    },
    spacing: {
      grid: '8px',
      padding: '24px',
    },
  },
  assetStructure: {
    logos: ['homy-logo-primary.svg', 'homy-logo-dark.svg', 'homy-trademark.svg'] as string[],
    screenshots: [
      'dashboard/main-view.png',
      'lab-card/normal-state.png',
      'neurofocus/coach-initial.png',
    ] as string[],
    icons: ['accessibility/*', 'navigation/*', 'indicators/*'] as string[],
    backgrounds: ['gradient-light.png', 'gradient-dark.png'] as string[],
  },
  exportSettings: {
    figma: {
      formats: ['PDF', 'PNG', 'SVG'] as string[],
      quality: 'High',
    },
    screenshots: {
      format: 'PNG',
      scale: '2x',
      shadow: 'Float',
    },
  },
};

export type TrademarkVisualKit = z.infer<typeof TrademarkVisualKitSchema>;

export function validateTrademarkKit(kit: unknown): TrademarkVisualKit {
  return TrademarkVisualKitSchema.parse(kit);
}

export function applyTrademarkGuidelines(component: string): string {
  return `${defaultTrademarkKit.brandName} ${component}`;
}
