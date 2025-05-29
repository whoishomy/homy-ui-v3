import type { InsightFeedback, FeedbackStats } from '@/types/feedback';
import type { FeedbackAggregator } from '@/types/feedback';

export interface OptimizationStrategy {
  name: string;
  description: string;
  weight: number;
  optimize: (feedback: InsightFeedback[], stats: FeedbackStats) => Promise<PromptOptimization>;
}

export interface PromptOptimization {
  strategy: string;
  confidence: number;  // 0-1
  suggestedChanges: {
    type: 'ADD' | 'REMOVE' | 'MODIFY';
    target: string;
    suggestion: string;
    reason: string;
    impact: number;  // Expected impact score (0-1)
  }[];
  metadata: {
    baselineScore: number;
    expectedImprovement: number;
    affectedCategories: string[];
    dataPoints: number;
  };
}

export class PromptOptimizer {
  private strategies: OptimizationStrategy[] = [];
  
  constructor(
    private readonly feedbackService: FeedbackAggregator,
    strategies?: OptimizationStrategy[]
  ) {
    this.strategies = strategies || this.getDefaultStrategies();
  }

  async optimizePrompt(insightId: string): Promise<PromptOptimization[]> {
    // Gather feedback data
    const feedback = await this.feedbackService.getInsightFeedback(insightId);
    const stats = await this.feedbackService.getFeedbackStats(insightId);

    // Apply each strategy
    const optimizations = await Promise.all(
      this.strategies.map(strategy => 
        strategy.optimize(feedback, stats)
      )
    );

    // Sort by confidence * weight
    return optimizations.sort((a, b) => {
      const strategyA = this.strategies.find(s => s.name === a.strategy)!;
      const strategyB = this.strategies.find(s => s.name === b.strategy)!;
      return (b.confidence * strategyB.weight) - (a.confidence * strategyA.weight);
    });
  }

  private getDefaultStrategies(): OptimizationStrategy[] {
    return [
      {
        name: 'clarity_improvement',
        description: 'Improves clarity based on user comprehension patterns',
        weight: 1.0,
        optimize: async (feedback, stats) => {
          const lowClarityFeedback = feedback.filter(f => 
            f.category === 'CLARITY' && f.score <= 3
          );

          if (lowClarityFeedback.length < 3) {
            return this.createEmptyOptimization('clarity_improvement');
          }

          const commonIssues = this.analyzeCommonIssues(lowClarityFeedback);
          return {
            strategy: 'clarity_improvement',
            confidence: this.calculateConfidence(lowClarityFeedback.length, feedback.length),
            suggestedChanges: this.generateClarityChanges(commonIssues),
            metadata: {
              baselineScore: stats.averageScore,
              expectedImprovement: 0.2,
              affectedCategories: ['CLARITY'],
              dataPoints: lowClarityFeedback.length
            }
          };
        }
      },
      {
        name: 'actionability_enhancement',
        description: 'Enhances actionable content in insights',
        weight: 0.8,
        optimize: async (feedback, stats) => {
          const actionabilityFeedback = feedback.filter(f =>
            f.category === 'ACTIONABILITY'
          );

          if (actionabilityFeedback.length < 3) {
            return this.createEmptyOptimization('actionability_enhancement');
          }

          const actionMetrics = this.analyzeActionability(actionabilityFeedback);
          return {
            strategy: 'actionability_enhancement',
            confidence: this.calculateConfidence(actionabilityFeedback.length, feedback.length),
            suggestedChanges: this.generateActionabilityChanges(actionMetrics),
            metadata: {
              baselineScore: stats.averageScore,
              expectedImprovement: 0.15,
              affectedCategories: ['ACTIONABILITY', 'USEFULNESS'],
              dataPoints: actionabilityFeedback.length
            }
          };
        }
      },
      {
        name: 'accuracy_optimization',
        description: 'Optimizes for factual accuracy and precision',
        weight: 1.2,
        optimize: async (feedback, stats) => {
          const accuracyFeedback = feedback.filter(f =>
            f.category === 'ACCURACY' && f.score <= 4
          );

          if (accuracyFeedback.length < 3) {
            return this.createEmptyOptimization('accuracy_optimization');
          }

          const accuracyPatterns = this.analyzeAccuracyPatterns(accuracyFeedback);
          return {
            strategy: 'accuracy_optimization',
            confidence: this.calculateConfidence(accuracyFeedback.length, feedback.length),
            suggestedChanges: this.generateAccuracyChanges(accuracyPatterns),
            metadata: {
              baselineScore: stats.averageScore,
              expectedImprovement: 0.25,
              affectedCategories: ['ACCURACY', 'USEFULNESS'],
              dataPoints: accuracyFeedback.length
            }
          };
        }
      }
    ];
  }

  private createEmptyOptimization(strategy: string): PromptOptimization {
    return {
      strategy,
      confidence: 0,
      suggestedChanges: [],
      metadata: {
        baselineScore: 0,
        expectedImprovement: 0,
        affectedCategories: [],
        dataPoints: 0
      }
    };
  }

  private calculateConfidence(sampleSize: number, totalSize: number): number {
    const minSamples = 3;
    const optimalSamples = 10;
    
    if (sampleSize < minSamples) return 0;
    if (sampleSize >= optimalSamples) return 1;
    
    return (sampleSize - minSamples) / (optimalSamples - minSamples);
  }

  private analyzeCommonIssues(feedback: InsightFeedback[]): any {
    // TODO: Implement common issues analysis
    return {};
  }

  private generateClarityChanges(issues: any): PromptOptimization['suggestedChanges'] {
    // TODO: Implement clarity changes generation
    return [];
  }

  private analyzeActionability(feedback: InsightFeedback[]): any {
    // TODO: Implement actionability analysis
    return {};
  }

  private generateActionabilityChanges(metrics: any): PromptOptimization['suggestedChanges'] {
    // TODO: Implement actionability changes generation
    return [];
  }

  private analyzeAccuracyPatterns(feedback: InsightFeedback[]): any {
    // TODO: Implement accuracy patterns analysis
    return {};
  }

  private generateAccuracyChanges(patterns: any): PromptOptimization['suggestedChanges'] {
    // TODO: Implement accuracy changes generation
    return [];
  }
} 