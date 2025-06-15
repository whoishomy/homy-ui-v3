import { z } from 'zod';

export const trademarkVisualKitSchema = z.object({
  visualIdentity: z.object({
    colors: z
      .object({
        primary: z.string(),
        success: z.string(),
        warning: z.string(),
        focus: z.string(),
      })
      .partial(),
    typography: z
      .object({
        title: z.string(),
        subtitle: z.string(),
        body: z.string(),
        fontSize: z.string(),
      })
      .partial(),
    spacing: z
      .object({
        padding: z.string(),
      })
      .partial(),
  }),
});

export type TrademarkVisualKit = z.infer<typeof trademarkVisualKitSchema>;

export const defaultTrademarkKit: TrademarkVisualKit = {
  visualIdentity: {
    colors: {
      primary: '#007AFF',
      success: '#34C759',
      warning: '#FF9500',
      focus: '#5856D6',
    },
    typography: {
      title: 'Inter/Bold',
      subtitle: 'Inter/Medium',
      body: 'Inter/Regular',
      fontSize: '16px',
    },
    spacing: {
      padding: '1rem',
    },
  },
};

export function validateTrademarkKit(kit: unknown): TrademarkVisualKit {
  return trademarkVisualKitSchema.parse(kit);
}

export function applyTrademarkGuidelines(component: string): string {
  return `${defaultTrademarkKit.brandName} ${component}`;
}
