import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InsightEngine } from '@/services/insightEngine';
import { HealthInsight, InsightCategory } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

// Mock the analytics service
vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    track: vi.fn(),
  },
}));

// Mock environment variables
vi.mock('@env', () => ({
  OPENAI_API_KEY: 'test-openai-key',
  ANTHROPIC_API_KEY: 'test-anthropic-key',
}));

describe('InsightEngine', () => {
  let engine: InsightEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = InsightEngine.getInstance();
  });

  afterEach(() => {
    // Reset the singleton instance
    (InsightEngine as any).instance = null;
  });

  describe('Insight Generation', () => {
    it('generates basic insight', async () => {
      const insight = await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {
          steps: 10000,
          distance: 8.5,
        },
      });

      expect(insight).toBeDefined();
      expect(insight.category).toBe(InsightCategory.PHYSICAL);
      expect(insight.type).toBe('success');
    });

    it('generates persona-based insight', async () => {
      const insight = await engine.generateInsightForPersona({
        persona: {
          id: 'test-user',
          age: 30,
          gender: 'MALE',
          conditions: ['diabetes'],
          preferences: {
            activityLevel: 'MODERATE',
          },
          culturalContext: {
            country: 'TR',
            language: 'tr',
          },
        },
        category: InsightCategory.HEALTH,
        metrics: {
          bloodSugar: 120,
          steps: 8000,
        },
      });

      expect(insight).toBeDefined();
      expect(insight.id).toContain('persona-test-user');
    });
  });

  describe('Cache Management', () => {
    it('uses cache for identical requests', async () => {
      const request = {
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      };

      // First call - should miss cache
      await engine.generateInsight(request);

      // Second call - should hit cache
      await engine.generateInsight(request);

      const stats = engine.getCacheStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('tracks cache performance', async () => {
      const requests = [
        { category: InsightCategory.PHYSICAL, metrics: { steps: 10000, duration: 0 } },
        { category: InsightCategory.SLEEP, metrics: { duration: 8, steps: 0 } },
        { category: InsightCategory.PHYSICAL, metrics: { steps: 10000, duration: 0 } }, // Cache hit
      ];

      for (const request of requests) {
        await engine.generateInsight(request);
      }

      const stats = engine.getCacheStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(2);
      expect(stats.size).toBe(2);
    });
  });

  describe('Error Handling & Resilience', () => {
    it('handles provider failures gracefully', async () => {
      const errorStats = engine.getErrorStats();
      const initialErrorCount = errorStats.timeline.reduce((sum, point) => sum + point.count, 0);

      try {
        await engine.generateInsight({
          category: 'INVALID' as InsightCategory,
          metrics: {},
        });
      } catch (error) {
        // Expected
      }

      const newErrorStats = engine.getErrorStats();
      const newErrorCount = newErrorStats.timeline.reduce((sum, point) => sum + point.count, 0);
      expect(newErrorCount).toBeGreaterThan(initialErrorCount);
    });

    it('provides telemetry data', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const telemetry = engine.getTelemetrySnapshot();
      expect(telemetry.insights.totalGenerated).toBeGreaterThan(0);
      expect(telemetry.insights.averageLatency).toBeGreaterThanOrEqual(0);
      expect(telemetry.cache.hitRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Analytics & Monitoring', () => {
    it('tracks provider health', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const health = engine.getProviderHealth();
      expect(health.openai.healthScore).toBeGreaterThan(0);
      expect(health.openai.healthScore).toBeLessThanOrEqual(100);
      expect(health.anthropic.healthScore).toBeGreaterThan(0);
      expect(health.anthropic.healthScore).toBeLessThanOrEqual(100);
    });

    it('compares provider performance', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const comparison = engine.getProviderComparison();
      expect(comparison.costComparison.openai).toBeDefined();
      expect(comparison.costComparison.anthropic).toBeDefined();
      expect(comparison.performanceComparison.openai.latency).toBeDefined();
      expect(comparison.performanceComparison.anthropic.latency).toBeDefined();
      expect(comparison.performanceComparison.openai.reliability).toBeDefined();
      expect(comparison.performanceComparison.anthropic.reliability).toBeDefined();
    });

    it('analyzes usage patterns', async () => {
      const requests = [
        { category: InsightCategory.PHYSICAL, metrics: { steps: 10000, duration: 0 } },
        { category: InsightCategory.SLEEP, metrics: { duration: 8, steps: 0 } },
        { category: InsightCategory.PHYSICAL, metrics: { steps: 12000, duration: 0 } },
      ];

      for (const request of requests) {
        await engine.generateInsight(request);
      }

      const patterns = engine.getUsagePatterns();
      expect(patterns.popularCategories).toContain(InsightCategory.PHYSICAL);
      expect(Object.keys(patterns.timeDistribution).length).toBeGreaterThan(0);
    });
  });

  describe('Time-based Analysis', () => {
    it('tracks error timeline', async () => {
      // Generate some errors
      try {
        await engine.generateInsight({
          category: 'INVALID' as InsightCategory,
          metrics: {},
        });
      } catch (error) {
        // Expected
      }

      const errorStats = engine.getErrorStats();
      expect(errorStats.timeline.length).toBeGreaterThan(0);
      expect(errorStats.timeline[0]).toHaveProperty('timestamp');
      expect(errorStats.timeline[0]).toHaveProperty('count');
    });
  });
}); 