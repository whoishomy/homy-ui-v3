import type { VitalSigns, VitalInsight } from '../types/vitals';

interface PromptContext {
  vitals: VitalSigns;
  insights: VitalInsight[];
  context: {
    name: string;
    timestamp: string;
  };
}

const generateMockInsights = (vitals: VitalSigns): VitalInsight[] => {
  const insights: VitalInsight[] = [];
  const timestamp = new Date().toISOString();

  // Check for critical conditions
  if (vitals.heartRateStatus === 'critical') {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 0.9,
      trends: ['rising'],
      recommendations: [
        'Notify rapid response team',
        'Prepare for possible intervention',
        'Check medication history',
      ],
      confidence: 0.95,
      context: {
        vitals: ['heartRate'],
        value: vitals.heartRate,
      },
      description: `Critical heart rate detected at ${vitals.heartRate} bpm - immediate attention required`,
      suggestedActions: [
        'Notify rapid response team',
        'Prepare for possible intervention',
        'Check medication history',
      ],
    });
  }

  if (vitals.bpStatus === 'critical') {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 0.9,
      trends: ['rising'],
      recommendations: [
        'Start fluid resuscitation',
        'Continuous BP monitoring',
        'Check for bleeding sources',
      ],
      confidence: 0.95,
      context: {
        vitals: ['systolicBP', 'diastolicBP'],
        values: {
          systolic: vitals.systolicBP,
          diastolic: vitals.diastolicBP,
        },
      },
      description: `Critical blood pressure at ${vitals.systolicBP}/${vitals.diastolicBP} mmHg - evaluate for shock`,
      suggestedActions: [
        'Start fluid resuscitation',
        'Continuous BP monitoring',
        'Check for bleeding sources',
      ],
    });
  }

  // Check for warning conditions
  if (vitals.temperatureStatus === 'high') {
    insights.push({
      timestamp,
      status: 'high',
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: [
        'Monitor temperature q2h',
        'Consider antipyretics',
        'Check for infection sources',
      ],
      confidence: 0.85,
      context: {
        vitals: ['temperature'],
        value: vitals.temperature,
      },
      description: `Elevated temperature at ${vitals.temperature}°C - monitor for infection`,
      suggestedActions: [
        'Monitor temperature q2h',
        'Consider antipyretics',
        'Check for infection sources',
      ],
    });
  }

  // Check for combined patterns
  if (
    vitals.temperatureStatus === 'high' &&
    vitals.heartRateStatus === 'high' &&
    vitals.respiratoryStatus === 'high'
  ) {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 0.9,
      trends: ['rising', 'rising', 'rising'],
      recommendations: [
        'Consider sepsis protocol',
        'Draw blood cultures',
        'Start broad-spectrum antibiotics',
      ],
      confidence: 0.9,
      context: {
        vitals: ['temperature', 'heartRate', 'respiratoryRate'],
        values: {
          temperature: vitals.temperature,
          heartRate: vitals.heartRate,
          respiratoryRate: vitals.respiratoryRate,
        },
      },
      description: 'Multiple vital sign abnormalities suggest systemic inflammatory response',
      suggestedActions: [
        'Consider sepsis protocol',
        'Draw blood cultures',
        'Start broad-spectrum antibiotics',
      ],
    });
  }

  if (vitals.heartRate > 100) {
    insights.push({
      timestamp: new Date().toISOString(),
      status: 'high',
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: ['Monitor heart rate closely', 'Check for signs of tachycardia'],
      confidence: 0.85,
      context: {
        vitals: ['heartRate'],
      },
      description: 'Elevated heart rate detected',
    });
  }

  if (vitals.systolicBP && vitals.systolicBP > 140) {
    insights.push({
      timestamp: new Date().toISOString(),
      status: 'high',
      type: 'alert',
      severity: 0.8,
      trends: ['rising'],
      recommendations: [
        'Check blood pressure again in 5 minutes',
        'Consider medication if persistent',
      ],
      confidence: 0.9,
      context: {
        vitals: ['systolicBP', 'diastolicBP'],
      },
      description: 'High blood pressure detected',
    });
  }

  if (vitals.temperatureStatus === 'high') {
    insights.push({
      timestamp: new Date().toISOString(),
      status: 'high',
      type: 'warning',
      severity: 0.6,
      trends: ['rising'],
      recommendations: ['Monitor temperature', 'Check for signs of infection'],
      confidence: 0.8,
      context: {
        vitals: ['temperature'],
      },
      description: 'Elevated temperature detected',
    });
  }

  if (
    vitals.temperatureStatus === 'high' &&
    vitals.heartRateStatus === 'high' &&
    vitals.respiratoryStatus === 'high'
  ) {
    insights.push({
      timestamp: new Date().toISOString(),
      status: 'critical',
      type: 'alert',
      severity: 0.9,
      trends: ['rising', 'rising', 'rising'],
      recommendations: [
        'Immediate clinical assessment required',
        'Consider sepsis protocol activation',
      ],
      confidence: 0.95,
      context: {
        vitals: ['temperature', 'heartRate', 'respiratoryRate'],
      },
      description: 'Multiple vital signs elevated - possible systemic response',
    });
  }

  return insights;
};

export const mockPromptEngine = {
  triggerPrompt: async (promptName: string, context: PromptContext) => {
    switch (promptName) {
      case 'clinical-alert':
        return {
          recommendations: [
            {
              priority: 'immediate',
              action: 'Evaluate patient immediately',
              rationale: 'Multiple critical vital signs detected',
              timeframe: 'Within 5 minutes',
            },
          ],
          escalationLevel: 'rapid-response',
          clinicalSummary: 'Patient showing signs of clinical deterioration',
          insights: generateMockInsights(context.vitals),
        };
      default:
        throw new Error(`Unknown prompt: ${promptName}`);
    }
  },
};
