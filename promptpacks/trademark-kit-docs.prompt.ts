import { z } from 'zod';

export const TrademarkDocsSchema = z.object({
  title: z.literal('HOMY™ Trademark Visual Kit Documentation'),
  version: z.string(),
  lastUpdated: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      examples: z.array(z.string()).optional(),
    })
  ),
});

export const trademarkDocs = {
  title: 'HOMY™ Trademark Visual Kit Documentation',
  version: '1.0.0',
  lastUpdated: '2024-03-21',
  sections: [
    {
      title: 'Brand Identity',
      content: `HOMY™ is a registered trademark pending EUIPO approval (filing date: 2024-06-06).
The brand name must always be written in uppercase with the ™ symbol: HOMY™.
Nice classifications: 44 (Healthcare), 9 (Software), 42 (SaaS).`,
      examples: ['Correct: HOMY™ NeuroFocus Coach', 'Incorrect: Homy', 'Incorrect: HOMY'],
    },
    {
      title: 'Color Palette',
      content: `Primary: #4A90E2 - Used for main actions and branding
Success: #4CAF50 - Used for positive feedback and completion
Focus: #9575CD - Used for focus states and attention
Warning: #FFB74D - Used for alerts and important notices`,
      examples: [
        'Primary buttons and headers',
        'Success messages and completion states',
        'Focus indicators and active states',
        'Warning messages and alerts',
      ],
    },
    {
      title: 'Typography',
      content: `Inter font family is used exclusively across all components:
Title: Inter Bold 48px
Subtitle: Inter Medium 24px
Body: Inter Regular 16px`,
      examples: [
        'Main headings: Inter Bold',
        'Section headings: Inter Medium',
        'Regular text: Inter Regular',
      ],
    },
    {
      title: 'Component Usage',
      content: `All components must use the useTrademarkStyle hook for consistent styling.
Component names in aria-labels must use getTrademarkName utility.
CSS variables are prefixed with --homy-* for theming.`,
      examples: [
        'const containerRef = useTrademarkStyle<HTMLDivElement>();',
        'aria-label={getTrademarkName("Component")}',
        'var(--homy-primary)',
      ],
    },
    {
      title: 'Asset Management',
      content: `Assets must follow the defined structure and naming conventions.
Use validateAssetPath utility to ensure compliance.
Export settings must follow the defined specifications.`,
      examples: [
        'logos/homy-logo-primary.svg',
        'screenshots/dashboard/main-view.png',
        'icons/accessibility/*',
      ],
    },
    {
      title: 'Accessibility',
      content: `All components must maintain WCAG 2.1 AA compliance.
Color contrast ratios must meet accessibility standards.
Interactive elements must have proper ARIA attributes.`,
      examples: ['Color contrast: 4.5:1 for text', 'role="region"', 'aria-label with trademark'],
    },
  ],
} as const;

export type TrademarkDocs = z.infer<typeof TrademarkDocsSchema>;

export function validateDocs(docs: unknown): TrademarkDocs {
  return TrademarkDocsSchema.parse(docs);
}

export function getDocSection(sectionTitle: string): string {
  const section = trademarkDocs.sections.find((s) => s.title === sectionTitle);
  return section ? section.content : 'Section not found';
}
