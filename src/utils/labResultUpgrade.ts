import { labResultUpgrade } from '../../promptpacks/labresult-upgrade-v2.prompt';
import { LabResult, LabResultTrend } from '@/types/lab-results';
import { generateEnhancedInsights } from './labInsightEngine';
import { AIGeneratedInsight } from '@/types/health-report';

export type ClinicalSignificance =
  | 'Critical - Immediate attention required'
  | 'Significant - Clinical review recommended'
  | 'Abnormal - Monitor closely'
  | 'Normal - Continue routine monitoring';

interface AIInsight {
  type: 'summary' | 'recommendation' | 'alert' | 'trend';
  content: string;
  confidence: number;
  sourceData: string[];
  timestamp: string;
  category: 'clinical' | 'technical' | 'patient';
  severity?: 'critical' | 'warning' | 'info';
}

type EnhancedLabResult = LabResult & {
  insights: AIInsight[];
  recommendations: string[];
  clinicalContext: {
    significance: ClinicalSignificance;
    relatedTests: string[];
    doctorNotes?: string;
  };
};

export function enhanceLabResult(result: LabResult): EnhancedLabResult {
  const enhancedInsights = generateEnhancedInsights(result);

  // Map enhanced insights to our existing format, filtering out 'pattern' type
  const insights: AIInsight[] = enhancedInsights.analysis
    .filter((insight) => insight.type !== 'pattern')
    .map((insight) => ({
      type:
        insight.type === 'correlation' ? 'summary' : insight.type === 'risk' ? 'alert' : 'trend',
      content: insight.message,
      confidence: insight.confidence,
      sourceData: [insight.source],
      timestamp: new Date().toISOString(),
      category: insight.category,
      severity: insight.severity,
    }));

  // Add trend-specific insights
  if (enhancedInsights.trends.prediction) {
    insights.push({
      type: 'trend',
      content: `Predicted next value: ${enhancedInsights.trends.prediction.nextValue.toFixed(2)} (${
        enhancedInsights.trends.prediction.confidence * 100
      }% confidence)`,
      confidence: enhancedInsights.trends.prediction.confidence,
      sourceData: ['Predictive Analysis Engine'],
      timestamp: new Date().toISOString(),
      category: 'technical',
      severity: 'info',
    });
  }

  // Determine clinical significance based on risk assessment
  const significance: ClinicalSignificance =
    enhancedInsights.risks.level === 'high'
      ? 'Critical - Immediate attention required'
      : enhancedInsights.risks.level === 'medium'
      ? 'Significant - Clinical review recommended'
      : enhancedInsights.trends.significance > 0.3
      ? 'Abnormal - Monitor closely'
      : 'Normal - Continue routine monitoring';

  return {
    ...result,
    insights,
    recommendations: [
      ...enhancedInsights.risks.preventiveActions,
      ...enhancedInsights.patientContext.nextSteps,
    ],
    clinicalContext: {
      significance,
      relatedTests: enhancedInsights.correlations.relatedTests.map((test) => test.testId),
      doctorNotes: enhancedInsights.patientContext.impact,
    },
  };
}
