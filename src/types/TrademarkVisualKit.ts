import { z } from 'zod';

export const breakpoints = ['sm', 'md', 'lg', 'xl'] as const;
export type Breakpoint = (typeof breakpoints)[number];

export const colorModes = ['light', 'dark'] as const;
export type ColorMode = (typeof colorModes)[number];

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export const trademarkVisualKitSchema = z.object({
  visualIdentity: z.object({
    colors: z
      .object({
        primary: z.string(),
        success: z.string(),
        warning: z.string(),
        focus: z.string(),
        // Dark mode variants
        dark: z
          .object({
            primary: z.string(),
            success: z.string(),
            warning: z.string(),
            focus: z.string(),
          })
          .optional(),
      })
      .partial(),
    typography: z
      .object({
        title: z.string(),
        subtitle: z.string(),
        body: z.string(),
        fontSize: z.union([z.string(), z.record(z.enum(breakpoints), z.string())]),
        letterSpacing: z.string().optional(),
        lineHeight: z.string().optional(),
      })
      .partial(),
    spacing: z
      .object({
        padding: z.union([z.string(), z.record(z.enum(breakpoints), z.string())]),
        gap: z.string().optional(),
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
      dark: {
        primary: '#0A84FF',
        success: '#30D158',
        warning: '#FF9F0A',
        focus: '#5E5CE6',
      },
    },
    typography: {
      title: 'Inter/Bold',
      subtitle: 'Inter/Medium',
      body: 'Inter/Regular',
      fontSize: {
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
      },
      letterSpacing: '-0.02em',
      lineHeight: '1.5',
    },
    spacing: {
      padding: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      gap: '1rem',
    },
  },
};

export function validateTrademarkKit(kit: unknown): TrademarkVisualKit {
  return trademarkVisualKitSchema.parse(kit);
}
