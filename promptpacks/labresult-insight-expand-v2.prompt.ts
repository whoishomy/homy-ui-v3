import { z } from 'zod';
import { defaultTrademarkKit } from './trademark-visual-kit.prompt';

export const LabResultInsightExpandSchema = z.object({
  version: z.literal('2.0.0'),
  insights: z.object({
    clinical: z.object({
      analysis: z.array(z.string()),
      patterns: z.array(z.string()),
      riskFactors: z.array(z.string()),
      correlations: z.array(z.string()),
    }),
    patient: z.object({
      explanations: z.array(z.string()),
      lifestyle: z.array(z.string()),
      preventive: z.array(z.string()),
      nextSteps: z.array(z.string()),
    }),
    technical: z.object({
      algorithms: z.array(z.string()),
      dataQuality: z.array(z.string()),
      methodology: z.array(z.string()),
      limitations: z.array(z.string()),
    }),
  }),
  visualization: z.object({
    components: z.array(z.string()),
    interactions: z.array(z.string()),
    accessibility: z.array(z.string()),
  }),
  integration: z.object({
    aiModels: z.array(z.string()),
    dataStreams: z.array(z.string()),
    alerts: z.array(z.string()),
  }),
});

export const labResultInsightExpand = {
  version: '2.0.0',
  insights: {
    clinical: {
      analysis: [
        'Trend velocity analysis',
        'Multi-parameter correlation',
        'Seasonal pattern detection',
        'Treatment response tracking',
        'Comorbidity impact assessment',
      ],
      patterns: [
        'Circadian rhythm variations',
        'Medication interaction patterns',
        'Lifestyle impact patterns',
        'Environmental factor correlations',
        'Stress response patterns',
      ],
      riskFactors: [
        'Age-specific risk analysis',
        'Genetic predisposition factors',
        'Lifestyle-related risks',
        'Environmental exposure risks',
        'Medication interaction risks',
      ],
      correlations: [
        'Inter-test relationships',
        'Symptom-result correlations',
        'Treatment-response patterns',
        'Lifestyle-impact correlations',
        'Time-based pattern analysis',
      ],
    },
    patient: {
      explanations: [
        'Visual result interpretation',
        'Trend significance explanation',
        'Health impact assessment',
        'Future projection insights',
        'Personalized health context',
      ],
      lifestyle: [
        'Diet impact analysis',
        'Exercise effect tracking',
        'Sleep quality correlation',
        'Stress level impact',
        'Daily routine optimization',
      ],
      preventive: [
        'Early warning indicators',
        'Preventive action suggestions',
        'Risk mitigation strategies',
        'Lifestyle modification recommendations',
        'Regular monitoring schedules',
      ],
      nextSteps: [
        'Follow-up recommendations',
        'Specialist consultation timing',
        'Test frequency optimization',
        'Lifestyle adjustment priorities',
        'Monitoring schedule updates',
      ],
    },
    technical: {
      algorithms: [
        'Machine learning models',
        'Statistical analysis methods',
        'Pattern recognition algorithms',
        'Predictive modeling techniques',
        'Anomaly detection systems',
      ],
      dataQuality: [
        'Measurement precision analysis',
        'Sample quality assessment',
        'Collection timing impact',
        'Processing method evaluation',
        'Storage condition effects',
      ],
      methodology: [
        'Test method validation',
        'Reference range calculation',
        'Interference analysis',
        'Calibration verification',
        'Quality control metrics',
      ],
      limitations: [
        'Analytical limitations',
        'Biological variation impact',
        'Pre-analytical variables',
        'Post-analytical considerations',
        'Result interpretation constraints',
      ],
    },
  },
  visualization: {
    components: [
      'Interactive trend lines',
      'Multi-parameter correlation maps',
      'Risk factor heat maps',
      'Predictive trend projections',
      'Reference range overlays',
      'Clinical significance indicators',
      'Patient-friendly explanatory graphics',
      'Time-based pattern visualizations',
    ],
    interactions: [
      'Zoom and pan controls',
      'Parameter comparison tools',
      'Time range selection',
      'Detail-on-demand tooltips',
      'Custom view configurations',
      'Export and share options',
      'Annotation capabilities',
      'Bookmark significant points',
    ],
    accessibility: [
      'Screen reader optimization',
      'Keyboard navigation support',
      'Color blind friendly palettes',
      'High contrast mode',
      'Font size adjustments',
      'Motion reduction options',
      'Audio feedback support',
      'Touch-friendly controls',
    ],
  },
  integration: {
    aiModels: [
      'GPT-4 for natural language insights',
      'Time series prediction models',
      'Pattern recognition networks',
      'Risk assessment algorithms',
      'Correlation analysis engines',
      'Anomaly detection systems',
      'Natural language generation',
      'Recommendation engines',
    ],
    dataStreams: [
      'Real-time lab results',
      'Historical patient data',
      'Environmental data feeds',
      'Lifestyle data integration',
      'Medication history',
      'Symptom tracking',
      'Wearable device data',
      'Clinical notes analysis',
    ],
    alerts: [
      'Critical value notifications',
      'Trend change alerts',
      'Pattern deviation warnings',
      'Follow-up reminders',
      'Risk level updates',
      'Action item notifications',
      'Integration status alerts',
      'System health monitoring',
    ],
  },
} as const;

export type LabResultInsightExpand = z.infer<typeof LabResultInsightExpandSchema>;

export function validateInsightExpand(config: unknown): LabResultInsightExpand {
  return LabResultInsightExpandSchema.parse(config);
}
