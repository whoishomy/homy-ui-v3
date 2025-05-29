import { definePromptPack } from '../../src/prompt-engine';
import { z } from 'zod';

const inputSchema = z.object({
  vitals: z.object({
    heartRate: z.number(),
    heartRateStatus: z.enum(['normal', 'warning', 'critical']),
    systolicBP: z.number(),
    diastolicBP: z.number(),
    bpStatus: z.enum(['normal', 'warning', 'critical']),
    temperature: z.number(),
    temperatureStatus: z.enum(['normal', 'warning', 'critical']),
    respiratoryRate: z.number(),
    respiratoryStatus: z.enum(['normal', 'warning', 'critical']),
  }),
  preferences: z.object({
    language: z.enum(['en', 'tr', 'es']),
    screenReader: z.boolean(),
    highContrast: z.boolean(),
    textSize: z.enum(['normal', 'large', 'xlarge']),
  }),
});

const outputSchema = z.object({
  insight: z.object({
    description: z.string(),
    severity: z.number(),
    ariaLabel: z.string(),
    ariaLive: z.enum(['off', 'polite', 'assertive']),
    actions: z.array(
      z.object({
        label: z.string(),
        ariaLabel: z.string(),
        shortcut: z.string(),
        role: z.string(),
      })
    ),
  }),
  accessibility: z.object({
    announcements: z.array(z.string()),
    keyboardShortcuts: z.record(z.string()),
    hapticFeedback: z.boolean(),
    colorScheme: z.object({
      background: z.string(),
      text: z.string(),
      contrastRatio: z.number(),
    }),
  }),
});

export default definePromptPack({
  name: 'clinical-insight-a11y',
  description: 'Generates accessible clinical insights with screen reader support',
  version: '1.0.0',
  input: inputSchema,
  output: outputSchema,
  prompts: [
    {
      role: 'system',
      content: `You are an AI assistant specialized in generating accessible clinical insights.
Your goal is to create insights that are:
1. Clear and concise for all users
2. Properly formatted for screen readers
3. Keyboard accessible
4. High contrast compliant
5. Multi-language ready`,
    },
    {
      role: 'user',
      content: `Generate an accessible clinical insight for the following vital signs:
{{vitals}}

User preferences:
{{preferences}}`,
    },
    {
      role: 'assistant',
      content: `I'll analyze the vital signs and generate an accessible insight:

1. First, I assess the severity and urgency
2. Then, I create clear, concise descriptions
3. I add proper ARIA labels and roles
4. I ensure keyboard shortcuts for actions
5. I verify contrast ratios meet WCAG AAA
6. I prepare screen reader announcements
7. I return the structured insight`,
    },
  ],
  examples: [
    {
      input: {
        vitals: {
          heartRate: 120,
          heartRateStatus: 'critical',
          systolicBP: 160,
          diastolicBP: 95,
          bpStatus: 'warning',
          temperature: 38.5,
          temperatureStatus: 'warning',
          respiratoryRate: 22,
          respiratoryStatus: 'warning',
        },
        preferences: {
          language: 'en',
          screenReader: true,
          highContrast: true,
          textSize: 'large',
        },
      },
      output: {
        insight: {
          description: 'Critical: Elevated heart rate with multiple vital sign abnormalities',
          severity: 3,
          ariaLabel: 'Critical alert: Heart rate 120, blood pressure 160/95, temperature 38.5',
          ariaLive: 'assertive',
          actions: [
            {
              label: 'Notify Team',
              ariaLabel: 'Notify medical team immediately',
              shortcut: 'Alt+N',
              role: 'button',
            },
            {
              label: 'View Details',
              ariaLabel: 'View detailed vital signs report',
              shortcut: 'Alt+D',
              role: 'button',
            },
          ],
        },
        accessibility: {
          announcements: [
            'Critical alert: Multiple abnormal vital signs detected',
            'Immediate medical attention required',
            'Press Alt+N to notify medical team',
          ],
          keyboardShortcuts: {
            'Alt+N': 'Notify team',
            'Alt+D': 'View details',
            'Alt+C': 'Clear alert',
          },
          hapticFeedback: true,
          colorScheme: {
            background: '#FF3B30',
            text: '#FFFFFF',
            contrastRatio: 7.5,
          },
        },
      },
    },
  ],
});
