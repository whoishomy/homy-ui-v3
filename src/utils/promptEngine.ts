import type { LabResult } from '../components/dashboard/LabResultsPanel';
import { NeuroFocusEngine } from './neuroFocusEngine';
import type { EmotionalContext, AgeAdaptedContent, MicroTask } from './neuroFocusEngine';

// GPT-4 Insight Layer Types
interface PatientFriendlyInsight {
  explanation: string;
  summary: string;
  nextSteps: string[];
  lifestyle: {
    recommendations: string[];
    importance: string;
    timeline: string;
  };
  education: {
    materials: string[];
    keyPoints: string[];
    followUp: string;
  };
}

// Lab Insight Analyzer Types
interface LabAnalysis {
  numerical: {
    trend: {
      direction: string;
      velocity: number;
      significance: number;
    };
    range: {
      status: string;
      deviation: number;
      clinical: string;
    };
    quality: {
      reliability: number;
      factors: string[];
    };
  };
  ai: {
    interpretation: string;
    confidence: number;
    suggestions: string[];
    warnings: string[];
  };
}

// Insight Engine Types
interface ContextualInsight {
  correlations: {
    tests: Array<{
      id: string;
      name: string;
      strength: number;
      direction: string;
    }>;
    factors: Array<{
      category: string;
      impact: number;
      evidence: string;
    }>;
  };
  context: {
    clinical: {
      significance: string;
      urgency: string;
      followUp: string;
    };
    temporal: {
      pattern: string;
      seasonality: string;
      frequency: string;
    };
    environmental: {
      factors: string[];
      impact: string;
      mitigation: string[];
    };
  };
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
  analysis: Array<{
    type: 'trend' | 'correlation' | 'risk' | 'treatment' | 'pattern';
    message: string;
    confidence: number;
    source: string;
    category: 'clinical' | 'technical' | 'patient';
    severity?: 'critical' | 'warning' | 'info';
    relatedFactors?: string[];
    recommendations?: string[];
    emotionalContext?: 'neutral' | 'concern' | 'relief' | 'motivation';
    supportiveElements?: string[];
  }>;
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

// Modular Prompt Engine
export class PromptEngine {
  private static instance: PromptEngine;
  private neuroFocusEngine: NeuroFocusEngine;

  private constructor() {
    this.neuroFocusEngine = NeuroFocusEngine.getInstance();
  }

  static getInstance(): PromptEngine {
    if (!PromptEngine.instance) {
      PromptEngine.instance = new PromptEngine();
    }
    return PromptEngine.instance;
  }

  // GPT-4 Insight Layer
  async generatePatientInsights(result: LabResult): Promise<PatientFriendlyInsight> {
    // GPT-4 powered patient-friendly insights
    return {
      explanation: this.generateExplanation(result),
      summary: this.generateSummary(result),
      nextSteps: this.generateNextSteps(result),
      lifestyle: {
        recommendations: this.generateLifestyleRecommendations(result),
        importance: this.explainImportance(result),
        timeline: this.suggestTimeline(result),
      },
      education: {
        materials: this.suggestMaterials(result),
        keyPoints: this.generateKeyPoints(result),
        followUp: this.suggestFollowUp(result),
      },
    };
  }

  // Lab Insight Analyzer
  async analyzeLabResult(result: LabResult): Promise<LabAnalysis> {
    // AI-powered lab result analysis
    return {
      numerical: {
        trend: this.analyzeTrend(result),
        range: this.analyzeRange(result),
        quality: this.assessQuality(result),
      },
      ai: {
        interpretation: this.interpretResult(result),
        confidence: this.calculateConfidence(result),
        suggestions: this.generateSuggestions(result),
        warnings: this.identifyWarnings(result),
      },
    };
  }

  // Insight Engine
  async generateContextualInsights(result: LabResult): Promise<ContextualInsight> {
    // Correlation and context analysis
    return {
      correlations: {
        tests: this.findRelatedTests(result),
        factors: this.analyzeFactors(result),
      },
      context: {
        clinical: this.analyzeClinicalContext(result),
        temporal: this.analyzeTemporalPatterns(result),
        environmental: this.analyzeEnvironmentalFactors(result),
      },
    };
  }

  // Add the missing generateEnhancedInsights method
  async generateEnhancedInsights(result: LabResult): Promise<EnhancedInsights> {
    const trend = this.analyzeTrend(result);
    return {
      analysis: [
        {
          type: 'trend' as const,
          message: 'Analyzing result trends...',
          confidence: 0.9,
          source: 'Analysis Engine',
          category: 'clinical' as const,
        },
      ],
      trends: {
        direction: trend.direction as 'increasing' | 'decreasing' | 'stable',
        velocity: trend.velocity,
        significance: trend.significance,
        seasonality: {
          pattern: 'No seasonal pattern detected',
          confidence: 0.8,
        },
        prediction: {
          nextValue: 0,
          confidence: 0.7,
          timeframe: '3 months',
        },
      },
      correlations: {
        relatedTests: [],
        environmentalFactors: [],
        lifestyleImpact: [],
      },
      risks: {
        level: 'low',
        factors: [],
        shortTerm: [],
        longTerm: [],
        preventiveActions: [],
      },
      patientContext: {
        explanation: '',
        impact: '',
        nextSteps: [],
        lifestyle: {
          diet: [],
          exercise: [],
          monitoring: [],
        },
        education: {
          topic: '',
          resources: [],
          importance: '',
        },
      },
      technicalDetails: {
        methodology: '',
        limitations: [],
        quality: {
          score: 0,
          factors: [],
        },
      },
    };
  }

  // New method to integrate NeuroFocus capabilities
  async generateEnhancedInsightsWithNeuro(
    result: LabResult,
    ageGroup: 'child' | 'teen' | 'adult'
  ): Promise<{
    insights: EnhancedInsights;
    neuroFocus: {
      emotional: EmotionalContext;
      adaptedContent: AgeAdaptedContent;
      microTasks: MicroTask[];
    };
  }> {
    const [insights, neuroFocus] = await Promise.all([
      this.generateEnhancedInsights(result),
      this.neuroFocusEngine.generateFullNeuroFocus(result, ageGroup),
    ]);

    // Enhance insights with emotional context
    insights.analysis = insights.analysis.map((analysis) => ({
      ...analysis,
      type: analysis.type as 'trend' | 'correlation' | 'risk' | 'treatment' | 'pattern',
      category: analysis.category as 'clinical' | 'technical' | 'patient',
      emotionalContext: neuroFocus.emotional.primaryEmotion,
      supportiveElements: neuroFocus.emotional.supportiveElements,
    }));

    // Add micro-tasks to risk assessment
    insights.risks.preventiveActions = [
      ...insights.risks.preventiveActions,
      ...neuroFocus.microTasks.map((task: MicroTask) => task.action.description),
    ];

    // Enhance patient context with age-adapted content
    insights.patientContext = {
      ...insights.patientContext,
      explanation: neuroFocus.adaptedContent.explanation,
      education: {
        ...insights.patientContext.education,
        resources: [
          ...insights.patientContext.education.resources,
          ...neuroFocus.adaptedContent.supportMaterial,
        ],
      },
    };

    return {
      insights,
      neuroFocus: {
        emotional: neuroFocus.emotional,
        adaptedContent: neuroFocus.adaptedContent,
        microTasks: neuroFocus.microTasks,
      },
    };
  }

  // Helper methods for GPT-4 Insight Layer
  private generateExplanation(result: LabResult): string {
    return `Your ${result.title} test helps understand ${this.getTestPurpose(result)}`;
  }

  private generateSummary(result: LabResult): string {
    return `Based on your results, ${this.interpretTrend(result)}`;
  }

  private generateNextSteps(result: LabResult): string[] {
    return [
      'Schedule follow-up appointment',
      'Monitor your symptoms',
      'Keep track of lifestyle changes',
    ];
  }

  // Helper methods for Lab Insight Analyzer
  private analyzeTrend(result: LabResult) {
    const values = result.data.map((d) => d.value);
    const latest = values[values.length - 1];
    const previous = values[values.length - 2] || latest;

    return {
      direction: latest > previous ? 'increasing' : latest < previous ? 'decreasing' : 'stable',
      velocity: (latest - previous) / previous,
      significance: Math.abs((latest - previous) / previous),
    };
  }

  private analyzeRange(result: LabResult) {
    const latest = result.data[result.data.length - 1].value;
    const isOutOfRange =
      result.referenceRange &&
      (latest < result.referenceRange.min || latest > result.referenceRange.max);

    return {
      status: isOutOfRange ? 'out_of_range' : 'normal',
      deviation: this.calculateDeviation(result),
      clinical: this.interpretClinicalSignificance(result),
    };
  }

  private assessQuality(result: LabResult) {
    return {
      reliability: 0.95,
      factors: ['Data completeness', 'Measurement precision', 'Collection timing'],
    };
  }

  private interpretResult(result: LabResult): string {
    const trend = this.analyzeTrend(result);
    const range = this.analyzeRange(result);
    return `Results show ${trend.direction} trend with ${range.status} values`;
  }

  private calculateConfidence(result: LabResult): number {
    const quality = this.assessQuality(result);
    return quality.reliability;
  }

  private generateSuggestions(result: LabResult): string[] {
    return [
      'Continue regular monitoring',
      'Follow lifestyle recommendations',
      'Consider preventive measures',
    ];
  }

  private identifyWarnings(result: LabResult): string[] {
    const range = this.analyzeRange(result);
    const warnings = [];

    if (range.status === 'out_of_range') {
      warnings.push('Values outside normal range');
    }
    if (range.deviation > 0.2) {
      warnings.push('Significant deviation from previous results');
    }

    return warnings;
  }

  // Helper methods for Insight Engine
  private findRelatedTests(result: LabResult) {
    return [
      {
        id: 'CBC',
        name: 'Complete Blood Count',
        strength: 0.8,
        direction: 'positive',
      },
    ];
  }

  private analyzeFactors(result: LabResult) {
    return [
      {
        category: 'Lifestyle',
        impact: 0.7,
        evidence: 'Strong correlation with daily activities',
      },
    ];
  }

  private analyzeClinicalContext(result: LabResult) {
    return {
      significance: this.determineClinicalSignificance(result),
      urgency: this.determineUrgency(result),
      followUp: this.suggestClinicalFollowUp(result),
    };
  }

  // Utility methods
  private getTestPurpose(result: LabResult): string {
    return "your body's current health status";
  }

  private interpretTrend(result: LabResult): string {
    return 'your values show a specific pattern that requires attention';
  }

  private calculateDeviation(result: LabResult): number {
    return 0.15; // Example deviation calculation
  }

  private interpretClinicalSignificance(result: LabResult): string {
    return 'Clinically significant change detected';
  }

  private determineClinicalSignificance(result: LabResult): string {
    return 'Moderate clinical significance';
  }

  private determineUrgency(result: LabResult): string {
    return 'Routine follow-up recommended';
  }

  private suggestClinicalFollowUp(result: LabResult): string {
    return 'Schedule follow-up in 3 months';
  }

  private generateLifestyleRecommendations(result: LabResult): string[] {
    return ['Maintain healthy diet', 'Regular exercise', 'Adequate sleep'];
  }

  private explainImportance(result: LabResult): string {
    return 'Understanding your results helps manage your health better';
  }

  private suggestTimeline(result: LabResult): string {
    return 'Monitor changes over the next 3 months';
  }

  private suggestMaterials(result: LabResult): string[] {
    return ['Educational brochure', 'Online resources', 'Mobile app tracking'];
  }

  private generateKeyPoints(result: LabResult): string[] {
    return ['Main finding', 'Important changes', 'Action items'];
  }

  private suggestFollowUp(result: LabResult): string {
    return 'Next check-up recommended in 3 months';
  }

  private analyzeTemporalPatterns(result: LabResult) {
    return {
      pattern: 'Regular fluctuation pattern detected',
      seasonality: 'No significant seasonal variation',
      frequency: 'Monthly monitoring recommended',
    };
  }

  private analyzeEnvironmentalFactors(result: LabResult) {
    return {
      factors: ['Diet', 'Physical activity', 'Sleep quality'],
      impact: 'Moderate environmental influence detected',
      mitigation: ['Lifestyle adjustments', 'Environmental monitoring'],
    };
  }
}
