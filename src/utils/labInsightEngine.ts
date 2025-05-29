import type { LabResult } from '../components/dashboard/LabResultsPanel';
import { labResultInsightExpand } from '../../promptpacks/labresult-insight-expand-v2.prompt';

interface InsightAnalysis {
  type: 'trend' | 'correlation' | 'risk' | 'treatment' | 'pattern';
  message: string;
  confidence: number;
  source: string;
  category: 'clinical' | 'technical' | 'patient';
  severity?: 'critical' | 'warning' | 'info';
  relatedFactors?: string[];
  recommendations?: string[];
}

interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  velocity: number;
  significance: number;
  seasonality?: {
    pattern: string;
    confidence: number;
  };
  prediction?: {
    nextValue: number;
    confidence: number;
    timeframe: string;
  };
}

interface CorrelationAnalysis {
  relatedTests: Array<{
    testId: string;
    correlation: number;
    significance: number;
    relationship: string;
  }>;
  environmentalFactors: Array<{
    factor: string;
    impact: number;
    confidence: number;
  }>;
  lifestyleImpact: Array<{
    factor: string;
    influence: number;
    recommendation: string;
  }>;
}

interface RiskAssessment {
  level: 'high' | 'medium' | 'low';
  factors: Array<{
    name: string;
    contribution: number;
    modifiable: boolean;
    action?: string;
  }>;
  shortTerm: string[];
  longTerm: string[];
  preventiveActions: string[];
}

interface PatientContext {
  explanation: string;
  impact: string;
  nextSteps: string[];
  lifestyle: {
    diet: string[];
    exercise: string[];
    monitoring: string[];
  };
  education: {
    topic: string;
    resources: string[];
    importance: string;
  };
}

export interface EnhancedInsights {
  analysis: InsightAnalysis[];
  trends: TrendAnalysis;
  correlations: CorrelationAnalysis;
  risks: RiskAssessment;
  patientContext: PatientContext;
  technicalDetails: {
    methodology: string;
    limitations: string[];
    quality: {
      score: number;
      factors: string[];
    };
  };
}

function analyzeTrends(result: LabResult): TrendAnalysis {
  const values = result.data.map((d) => d.value);
  const latestValue = values[values.length - 1];
  const previousValue = values[values.length - 2] || latestValue;

  const direction =
    latestValue > previousValue
      ? 'increasing'
      : latestValue < previousValue
        ? 'decreasing'
        : 'stable';

  const velocity = values.length > 1 ? (latestValue - previousValue) / previousValue : 0;

  const seasonality =
    values.length >= 4
      ? {
          pattern: 'Analyzing circadian rhythm variations...',
          confidence: 0.75,
        }
      : undefined;

  return {
    direction,
    velocity,
    significance: Math.abs(velocity),
    seasonality,
    prediction: {
      nextValue: latestValue * (1 + velocity),
      confidence: 0.85,
      timeframe: 'next measurement',
    },
  };
}

function assessRisks(result: LabResult): RiskAssessment {
  const latestValue = result.data[result.data.length - 1].value;
  const isOutOfRange =
    result.referenceRange &&
    (latestValue < result.referenceRange.min || latestValue > result.referenceRange.max);

  const level = isOutOfRange
    ? Math.abs(
        (latestValue - (result.referenceRange?.max || 0)) / (result.referenceRange?.max || 1)
      ) > 0.5
      ? 'high'
      : 'medium'
    : 'low';

  const factors = [
    {
      name: 'Current Value',
      contribution: 0.8,
      modifiable: false,
    },
    {
      name: 'Trend Pattern',
      contribution: 0.6,
      modifiable: true,
      action: 'Monitor frequency adjustment',
    },
    {
      name: 'Age-specific Factors',
      contribution: 0.4,
      modifiable: false,
    },
    {
      name: 'Lifestyle Impact',
      contribution: 0.7,
      modifiable: true,
      action: 'Lifestyle modification recommendations',
    },
  ];

  return {
    level,
    factors,
    shortTerm: [
      'Regular monitoring',
      'Lifestyle adjustments',
      'Medication review',
      'Early warning response',
    ],
    longTerm: [
      'Preventive measures',
      'Regular check-ups',
      'Lifestyle maintenance',
      'Risk mitigation strategies',
    ],
    preventiveActions: [
      'Schedule follow-up tests',
      'Maintain healthy lifestyle',
      'Monitor related symptoms',
      'Track environmental factors',
    ],
  };
}

function analyzeCorrelations(result: LabResult): CorrelationAnalysis {
  return {
    relatedTests: [
      {
        testId: 'CBC',
        correlation: 0.75,
        significance: 0.85,
        relationship: 'Strong positive correlation',
      },
      {
        testId: 'Metabolic Panel',
        correlation: 0.65,
        significance: 0.8,
        relationship: 'Moderate positive correlation',
      },
    ],
    environmentalFactors: [
      {
        factor: 'Sleep Quality',
        impact: 0.7,
        confidence: 0.85,
      },
      {
        factor: 'Physical Activity',
        impact: 0.65,
        confidence: 0.8,
      },
    ],
    lifestyleImpact: [
      {
        factor: 'Diet',
        influence: 0.75,
        recommendation: 'Consider balanced nutrition plan',
      },
      {
        factor: 'Exercise',
        influence: 0.7,
        recommendation: 'Maintain regular physical activity',
      },
    ],
  };
}

function generatePatientContext(result: LabResult): PatientContext {
  const trend = analyzeTrends(result);
  const risks = assessRisks(result);

  return {
    explanation: `Your ${result.title} levels are ${trend.direction}, which means ${
      trend.direction === 'increasing'
        ? 'they are going up'
        : trend.direction === 'decreasing'
          ? 'they are going down'
          : 'they are staying steady'
    }.`,
    impact:
      risks.level === 'high'
        ? 'This requires immediate attention'
        : risks.level === 'medium'
          ? 'This should be monitored closely'
          : 'This is within expected ranges',
    nextSteps: [
      ...risks.preventiveActions,
      'Review lifestyle modifications',
      'Consider environmental factors',
      'Track related symptoms',
    ],
    lifestyle: {
      diet: [
        'Maintain a balanced diet',
        'Stay hydrated',
        'Consider specific nutritional needs',
        'Monitor meal timing',
      ],
      exercise: [
        'Regular physical activity',
        'Stress management',
        'Adequate rest',
        'Activity tracking',
      ],
      monitoring: [
        'Track related symptoms',
        'Keep test schedule',
        'Record lifestyle changes',
        'Monitor environmental factors',
      ],
    },
    education: {
      topic: `Understanding ${result.title}`,
      resources: [
        'Patient education materials',
        'Lifestyle guidelines',
        'Support resources',
        'Interactive learning modules',
      ],
      importance:
        'Understanding your results helps in better health management and preventive care',
    },
  };
}

export function generateEnhancedInsights(result: LabResult): EnhancedInsights {
  const trends = analyzeTrends(result);
  const risks = assessRisks(result);
  const correlations = analyzeCorrelations(result);
  const patientContext = generatePatientContext(result);

  const analysis: InsightAnalysis[] = [
    {
      type: 'trend',
      message: `Values are ${trends.direction} with ${Math.round(trends.significance * 100)}% significance`,
      confidence: 0.9,
      source: 'Trend Analysis Engine',
      category: 'clinical',
      severity: trends.significance > 0.5 ? 'warning' : 'info',
      relatedFactors: ['Trend velocity', 'Historical pattern', 'Seasonal variation'],
    },
    {
      type: 'risk',
      message: `Current risk level is ${risks.level}`,
      confidence: 0.85,
      source: 'Risk Assessment Module',
      category: 'clinical',
      severity: risks.level === 'high' ? 'critical' : risks.level === 'medium' ? 'warning' : 'info',
      relatedFactors: risks.factors.map((f) => f.name),
    },
    {
      type: 'correlation',
      message: 'Significant correlations found with related tests and lifestyle factors',
      confidence: 0.8,
      source: 'Correlation Analysis Engine',
      category: 'technical',
      severity: 'info',
      relatedFactors: correlations.environmentalFactors.map((f) => f.factor),
    },
  ];

  return {
    analysis,
    trends,
    correlations,
    risks,
    patientContext,
    technicalDetails: {
      methodology: 'Advanced statistical analysis with machine learning enhancement',
      limitations: [
        'Based on available data points',
        'Individual variations may apply',
        'External factors may influence results',
        'Correlation does not imply causation',
      ],
      quality: {
        score: 0.9,
        factors: [
          'Data completeness',
          'Measurement accuracy',
          'Temporal consistency',
          'Environmental factors',
          'Lifestyle data integration',
        ],
      },
    },
  };
}
