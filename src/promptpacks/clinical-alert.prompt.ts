import { z } from 'zod';
import { definePromptPack } from '../prompt-engine';
import type { VitalSigns, VitalInsight } from '../types/vitals';
import type { AgentContext } from '../types';

const ClinicalAlertInputSchema = z.object({
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
    timestamp: z.string(),
  }),
  insights: z.array(
    z.object({
      type: z.enum(['warning', 'alert', 'info']),
      description: z.string(),
      severity: z.number(),
      relatedVitals: z.array(z.string()),
    })
  ),
  context: z.object({
    name: z.string(),
    timestamp: z.string(),
  }),
});

const ClinicalAlertOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      priority: z.enum(['immediate', 'urgent', 'routine']),
      action: z.string(),
      rationale: z.string(),
      timeframe: z.string(),
    })
  ),
  escalationLevel: z.enum(['none', 'nurse', 'rapid-response', 'emergency']),
  clinicalSummary: z.string(),
  suggestedOrders: z.array(z.string()).optional(),
});

export const clinicalAlertPromptPack = definePromptPack({
  name: 'clinical-alert',
  description: 'Generates clinical recommendations for critical vital signs',
  version: '1.0.0',
  input: ClinicalAlertInputSchema,
  output: ClinicalAlertOutputSchema,
  prompts: [
    {
      role: 'system',
      content: `You are a Clinical Decision Support System specializing in acute care and rapid response.

Your task is to:
1. Analyze critical vital signs and their patterns
2. Generate evidence-based clinical recommendations
3. Determine appropriate escalation levels
4. Suggest immediate interventions and monitoring plans

Guidelines:
- Prioritize patient safety and early intervention
- Consider multiple organ systems and their interactions
- Provide clear, actionable recommendations
- Include specific timeframes for each action
- Suggest appropriate diagnostic tests when needed
- Consider common complications and preventive measures

Remember:
- Critical vital signs require immediate attention
- Multiple abnormal vitals may indicate systemic issues
- Consider trending and rate of change
- Include both immediate actions and monitoring plans`,
    },
    {
      role: 'user',
      content: `Analyze the following vital signs and insights:

Vitals:
{{vitals}}

Clinical Insights:
{{insights}}

Context:
{{context}}

Generate clinical recommendations, determine escalation level, and provide a clinical summary.`,
    },
  ],
  examples: [
    {
      input: {
        vitals: {
          heartRate: 120,
          heartRateStatus: 'critical',
          systolicBP: 85,
          diastolicBP: 50,
          bpStatus: 'critical',
          temperature: 38.5,
          temperatureStatus: 'warning',
          respiratoryRate: 24,
          respiratoryStatus: 'warning',
          timestamp: '2024-03-26T10:30:00Z',
        },
        insights: [
          {
            type: 'alert',
            description: 'Critical heart rate and blood pressure - possible shock',
            severity: 3,
            relatedVitals: ['heartRate', 'systolicBP', 'diastolicBP'],
          },
        ],
        context: {
          name: 'vital-signs-monitor',
          timestamp: '2024-03-26T10:30:00Z',
        },
      },
      output: {
        recommendations: [
          {
            priority: 'immediate',
            action: 'Establish IV access and initiate fluid resuscitation',
            rationale: 'Signs of shock with hypotension and tachycardia',
            timeframe: 'Within 5 minutes',
          },
          {
            priority: 'immediate',
            action: 'Obtain 12-lead ECG',
            rationale: 'Rule out cardiac cause of shock',
            timeframe: 'Within 5 minutes',
          },
          {
            priority: 'urgent',
            action: 'Draw blood cultures and lactate',
            rationale: 'Evaluate for sepsis and tissue perfusion',
            timeframe: 'Within 15 minutes',
          },
        ],
        escalationLevel: 'rapid-response',
        clinicalSummary:
          'Patient presenting with signs of shock (HR 120, BP 85/50) and fever (38.5°C). Immediate fluid resuscitation and rapid response team activation recommended. Consider sepsis protocol initiation.',
        suggestedOrders: [
          'IV fluid bolus 1L NS',
          'Continuous vital signs monitoring',
          'Serial lactate measurements',
          'Blood cultures x2',
          'CBC, CMP, coags',
        ],
      },
    },
  ],
});
