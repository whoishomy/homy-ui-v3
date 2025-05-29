import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InsightEngine } from '../insightEngine';
import { InsightCategory } from '@/types/analytics';

// Mock environment variables
vi.mock('@env', () => ({
  OPENAI_API_KEY: 'test-openai-key',
  ANTHROPIC_API_KEY: 'test-anthropic-key',
}));

describe('InsightEngine', () => {
  let engine: InsightEngine;

  beforeEach(() => {
    vi.useFakeTimers();
    engine = InsightEngine.getInstance();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
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
    });

    it('generates persona-based insight', async () => {
      const insight = await engine.generateInsightForPersona({
        category: InsightCategory.HEALTH,
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
        metrics: {
          bloodSugar: 120,
          steps: 8000,
        },
      });

      expect(insight).toBeDefined();
      expect(insight.id).toContain('persona-test-user');
    });
  });

  describe('Monitoring & Telemetry', () => {
    it('tracks provider health', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const health = engine.getProviderHealth();
      expect(health.openai.healthScore).toBeGreaterThan(0);
      expect(health.openai.healthScore).toBeLessThanOrEqual(100);
    });

    it('provides telemetry snapshot', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const snapshot = engine.getTelemetrySnapshot();
      expect(snapshot.insights.totalGenerated).toBeGreaterThan(0);
      expect(snapshot.insights.averageLatency).toBeGreaterThanOrEqual(0);
      expect(snapshot.cache.hitRate).toBeGreaterThanOrEqual(0);
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

    it('tracks cache statistics', async () => {
      // First call - cache miss
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      // Second call - should be cache hit
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      const stats = engine.getCacheStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.size).toBe(1);
    });

    it('provides error statistics', async () => {
      // Force an error by using invalid metrics
      try {
        await engine.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: {},
        });
      } catch (error) {
        // Expected
      }

      const errorStats = engine.getErrorStats();
      expect(errorStats.timeline.length).toBeGreaterThan(0);
      expect(errorStats.timeline[0]).toHaveProperty('count');
    });

    it('analyzes usage patterns', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      await engine.generateInsight({
        category: InsightCategory.SLEEP,
        metrics: { duration: 8 },
      });

      const patterns = engine.getUsagePatterns();
      expect(patterns.popularCategories.length).toBe(2);
      expect(Object.keys(patterns.timeDistribution).length).toBeGreaterThan(0);
    });
  });

  describe('Error Timeline Analysis', () => {
    it('tracks errors over time', async () => {
      const start = new Date('2024-01-01');
      const middle = new Date('2024-01-02');
      const end = new Date('2024-01-03');

      // Generate some errors at different times
      vi.setSystemTime(start);
      try {
        await engine.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: {},
        });
      } catch (error) {
        // Expected
      }

      vi.setSystemTime(middle);
      try {
        await engine.generateInsight({
          category: InsightCategory.SLEEP,
          metrics: {},
        });
      } catch (error) {
        // Expected
      }

      vi.setSystemTime(end);
      const errorStats = engine.getErrorStats();
      expect(errorStats.timeline.length).toBeGreaterThan(0);
      
      // Verify timestamps are within range
      const timestamps = errorStats.timeline.map(entry => entry.timestamp);
      expect(Math.min(...timestamps)).toBeGreaterThanOrEqual(start.getTime());
      expect(Math.max(...timestamps)).toBeLessThanOrEqual(end.getTime());
    });
  });
}); 