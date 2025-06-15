import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { PromptOptimizer } from '../feedback/PromptOptimizer';
import type { InsightFeedback, FeedbackStats, FeedbackAggregator } from '@/types/feedback';
import type { HealthInsight, InsightType, InsightCategory } from '@/types/analytics';

describe('PromptOptimizer', () => {
  let optimizer: PromptOptimizer;
  let mockFeedbackService: FeedbackAggregator;

  const mockInsight: HealthInsight = {
    id: 'test-insight-1',
    type: 'success' as InsightType,
    category: 'PHYSICAL' as InsightCategory,
    message: 'Test insight message',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'test-provider',
  };

  const createMockFeedback = (
    category: InsightFeedback['category'],
    score: InsightFeedback['score'],
    comment?: string
  ): InsightFeedback => ({
    id: `feedback-${Math.random()}`,
    insightId: 'test-insight-1',
    insight: mockInsight,
    category,
    score,
    source: 'USER_EXPLICIT',
    comment,
    metadata: {
      timestamp: new Date(),
      sessionId: 'test-session',
      userId: 'test-user',
      interactionContext: {
        timeSpentViewing: 5000,
        expanded: true,
        shared: false,
      }
    },
    annotations: {
      tags: ['test'],
      sentimentScore: 0.5,
      contentQualityMetrics: {
        relevance: 0.8,
        specificity: 0.7,
        actionability: 0.6
      }
    }
  });

  const mockStats: FeedbackStats = {
    insightId: 'test-insight-1',
    averageScore: 3.5,
    scoreDistribution: {
      1: 1,
      2: 2,
      3: 3,
      4: 2,
      5: 1
    },
    totalFeedbackCount: 9,
    categoryBreakdown: {
      ACCURACY: 2,
      USEFULNESS: 2,
      CLARITY: 3,
      ACTIONABILITY: 2
    },
    userSentiment: 0.3,
    commonTags: ['helpful', 'unclear', 'technical'],
    performanceMetrics: {
      averageViewTime: 5000,
      actionClickRate: 0.4,
      expansionRate: 0.7,
      shareRate: 0.2
    }
  };

  beforeEach(() => {
    mockFeedbackService = {
      addFeedback: jest.fn(),
      getFeedbackStats: jest.fn().mockResolvedValue(mockStats),
      getInsightFeedback: jest.fn(),
      getUserFeedbackHistory: jest.fn(),
      updateAnnotations: jest.fn(),
    };
    optimizer = new PromptOptimizer(mockFeedbackService);
  });

  describe('optimizePrompt', () => {
    it('returns empty optimizations when insufficient feedback', async () => {
      const mockFeedback = [
        createMockFeedback('CLARITY', 3),
        createMockFeedback('ACCURACY', 4),
      ];

      mockFeedbackService.getInsightFeedback = jest.fn().mockResolvedValue(mockFeedback);

      const optimizations = await optimizer.optimizePrompt('test-insight-1');

      expect(optimizations).toHaveLength(3); // One for each strategy
      optimizations.forEach(opt => {
        expect(opt.confidence).toBe(0);
        expect(opt.suggestedChanges).toHaveLength(0);
      });
    });

    it('generates clarity improvements for low clarity scores', async () => {
      const mockFeedback = [
        createMockFeedback('CLARITY', 2, 'Too technical'),
        createMockFeedback('CLARITY', 2, 'Hard to understand'),
        createMockFeedback('CLARITY', 3, 'Could be clearer'),
        createMockFeedback('CLARITY', 4, 'Pretty clear'),
      ];

      mockFeedbackService.getInsightFeedback = jest.fn().mockResolvedValue(mockFeedback);

      const optimizations = await optimizer.optimizePrompt('test-insight-1');
      const clarityOpt = optimizations.find(o => o.strategy === 'clarity_improvement');

      expect(clarityOpt).toBeDefined();
      expect(clarityOpt!.confidence).toBeGreaterThan(0);
      expect(clarityOpt!.metadata.affectedCategories).toContain('CLARITY');
    });

    it('prioritizes accuracy optimizations with higher weight', async () => {
      const mockFeedback = Array(5).fill(null).map(() => 
        createMockFeedback('ACCURACY', 3, 'Could be more accurate')
      );

      mockFeedbackService.getInsightFeedback = jest.fn().mockResolvedValue(mockFeedback);

      const optimizations = await optimizer.optimizePrompt('test-insight-1');
      
      // Accuracy should be first due to higher weight (1.2)
      expect(optimizations[0].strategy).toBe('accuracy_optimization');
    });

    it('calculates confidence based on sample size', async () => {
      const mockFeedback = Array(8).fill(null).map(() =>
        createMockFeedback('ACTIONABILITY', 3, 'Need more specific actions')
      );

      mockFeedbackService.getInsightFeedback = jest.fn().mockResolvedValue(mockFeedback);

      const optimizations = await optimizer.optimizePrompt('test-insight-1');
      const actionabilityOpt = optimizations.find(o => o.strategy === 'actionability_enhancement');

      expect(actionabilityOpt!.confidence).toBeGreaterThan(0.5);
      expect(actionabilityOpt!.confidence).toBeLessThan(1);
    });

    it('includes metadata in optimization results', async () => {
      const mockFeedback = Array(5).fill(null).map(() =>
        createMockFeedback('ACCURACY', 3, 'Needs improvement')
      );

      mockFeedbackService.getInsightFeedback = jest.fn().mockResolvedValue(mockFeedback);

      const optimizations = await optimizer.optimizePrompt('test-insight-1');
      
      optimizations.forEach(opt => {
        expect(opt.metadata).toEqual(expect.objectContaining({
          baselineScore: expect.any(Number),
          expectedImprovement: expect.any(Number),
          affectedCategories: expect.any(Array),
          dataPoints: expect.any(Number)
        }));
      });
    });
  });
}); 