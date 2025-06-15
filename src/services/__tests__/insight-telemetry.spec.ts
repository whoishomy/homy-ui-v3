import { describe, it, expect, beforeEach, jest  } from '@jest/globals';
import { InMemoryTelemetry } from '../telemetry/InMemoryTelemetry';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { InsightMetric, TelemetrySnapshot } from '../telemetry/InsightTelemetry';
import { InsightCategory } from '@/types/analytics';

describe('InMemoryTelemetry', () => {
  let telemetry: InMemoryTelemetry;
  let cache: InMemoryInsightCache;

  const createMetric = (overrides?: Partial<InsightMetric>): InsightMetric => ({
    timestamp: Date.now(),
    duration: 500,
    provider: 'openai',
    success: true,
    cacheHit: false,
    insightType: 'success',
    cost: 0.02,
    ...overrides,
  });

  beforeEach(() => {
    jest.useFakeTimers();
    cache = new InMemoryInsightCache();
    telemetry = new InMemoryTelemetry({ cache });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Metrics', () => {
    it('records and retrieves metrics', () => {
      const metric = createMetric();
      telemetry.recordMetric(metric);

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(1);
      expect(snapshot.costs.byProvider.openai).toBe(0.02);
    });

    it('respects maxMetrics limit', () => {
      const telemetry = new InMemoryTelemetry({ maxMetrics: 2 });

      telemetry.recordMetric(createMetric({ timestamp: 1 }));
      telemetry.recordMetric(createMetric({ timestamp: 2 }));
      telemetry.recordMetric(createMetric({ timestamp: 3 }));

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(2);
    });
  });

  describe('Provider Metrics', () => {
    it('calculates provider costs correctly', () => {
      // OpenAI cost
      telemetry.recordMetric(
        createMetric({
          provider: 'openai',
          cost: 0.02,
        })
      );

      // Claude cost
      telemetry.recordMetric(
        createMetric({
          provider: 'anthropic',
          cost: 0.015,
        })
      );

      const comparison = telemetry.getProviderComparison();
      expect(comparison.costComparison.openai.totalCost).toBe(0.02);
      expect(comparison.costComparison.anthropic.totalCost).toBe(0.015);
    });

    it('tracks success rates', () => {
      telemetry.recordMetric(createMetric({ success: true }));
      telemetry.recordMetric(createMetric({ success: false }));
      telemetry.recordMetric(createMetric({ success: true }));

      const comparison = telemetry.getProviderComparison();
      expect(comparison.performanceComparison.openai.successRate).toBe(2 / 3);
    });
  });

  describe('Cache Metrics', () => {
    it('tracks cache hits and misses', () => {
      telemetry.recordMetric(createMetric({ cacheHit: true }));
      telemetry.recordMetric(createMetric({ cacheHit: false }));
      telemetry.recordMetric(createMetric({ cacheHit: true }));

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.cacheHitRate).toBe(2 / 3);
    });

    it('includes cache size from InMemoryInsightCache', () => {
      // Add some entries to cache
      cache.set(
        {
          provider: 'test',
          prompt: '1',
          systemPrompt: 'test',
          options: { temperature: 0.7 },
        },
        {
          id: '1',
          type: 'success',
          category: InsightCategory.PHYSICAL,
          message: 'test',
          date: new Date(),
          relatedMetrics: [],
        }
      );

      cache.set(
        {
          provider: 'test',
          prompt: '2',
          systemPrompt: 'test',
          options: { temperature: 0.7 },
        },
        {
          id: '2',
          type: 'success',
          category: InsightCategory.PHYSICAL,
          message: 'test',
          date: new Date(),
          relatedMetrics: [],
        }
      );

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(0);
    });
  });

  describe('Error Tracking', () => {
    it('tracks errors by type and provider', () => {
      telemetry.recordError(new Error('API Error'), { provider: 'openai' });
      telemetry.recordError(new TypeError('Type Error'), { provider: 'openai' });
      telemetry.recordError(new Error('Network Error'), { provider: 'anthropic' });

      const errorStats = telemetry.getErrorStats();
      expect(errorStats.totalErrors).toBe(3);
      expect(errorStats.byType.Error).toBe(2);
      expect(errorStats.byType.TypeError).toBe(1);
      expect(errorStats.byProvider.openai).toBe(2);
      expect(errorStats.byProvider.anthropic).toBe(1);
    });
  });

  describe('Usage Patterns', () => {
    it('identifies popular categories', () => {
      telemetry.recordMetric(createMetric());
      telemetry.recordMetric(createMetric());
      telemetry.recordMetric(createMetric());

      const patterns = telemetry.getInsightUsagePatterns();
      expect(patterns.popularCategories[0]).toEqual({
        category: 'success',
        count: 3,
      });
    });

    it('tracks time distribution', () => {
      const now = new Date('2024-01-01T14:00:00'); // 14:00
      jest.setSystemTime(now);

      telemetry.recordMetric(createMetric());
      telemetry.recordMetric(createMetric());

      const patterns = telemetry.getInsightUsagePatterns();
      expect(patterns.timeDistribution['14']).toBe(2);
    });
  });

  describe('Time Range Filtering', () => {
    it('filters metrics by time range', () => {
      const start = new Date('2024-01-01T00:00:00');
      const middle = new Date('2024-01-02T00:00:00');
      const end = new Date('2024-01-03T00:00:00');

      jest.setSystemTime(start);
      telemetry.recordMetric(createMetric());

      jest.setSystemTime(middle);
      telemetry.recordMetric(createMetric());

      jest.setSystemTime(end);
      telemetry.recordMetric(createMetric());

      const snapshot = telemetry.getSnapshot({
        start: middle,
        end,
      });

      expect(snapshot.insights.totalGenerated).toBe(2);
    });
  });
});
