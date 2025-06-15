import { jest, describe, it, expect, beforeEach, afterEach  } from '@jest/globals';
import { InsightEngine } from '@/services/insightEngine';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('InsightEngine Tests', () => {
  let engine: InsightEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = InsightEngine.getInstance();
  });

  afterEach(() => {
    // Reset the singleton instance
    (InsightEngine as any).instance = null;
  });

  describe('Basic Insight Generation', () => {
    it('should generate basic insight', async () => {
      const result = await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {
          steps: 10000,
          distance: 8.5
        }
      });

      expect(result).toBeDefined();
      expect(result.category).toBe(InsightCategory.PHYSICAL);
      expect(result.type).toBe('success');
      expect(result.relatedMetrics).toContain('steps');
      expect(result.relatedMetrics).toContain('distance');
    });

    it('should generate persona-based insight', async () => {
      const result = await engine.generateInsightForPersona({
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
          }
        },
        metrics: {
          bloodSugar: 120,
          steps: 8000
        }
      });

      expect(result).toBeDefined();
      expect(result.category).toBe(InsightCategory.HEALTH);
      expect(result.id).toContain('persona-test-user');
    });
  });

  describe('Cache Behavior', () => {
    it('should cache and return cached insights', async () => {
      const request = {
        category: InsightCategory.PHYSICAL,
        metrics: {
          steps: 10000
        }
      };

      // First call should generate new insight
      const result1 = await engine.generateInsight(request);
      expect(result1).toBeDefined();

      // Second call with same params should return cached
      const result2 = await engine.generateInsight(request);
      expect(result2).toEqual(result1);

      const stats = engine.getCacheStats();
      expect(stats.hits).toBeGreaterThan(0);
    });
  });

  describe('Usage Patterns', () => {
    it('should track usage patterns', async () => {
      await engine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 }
      });

      await engine.generateInsight({
        category: InsightCategory.SLEEP,
        metrics: { sleepHours: 8 }
      });

      const patterns = engine.getUsagePatterns();
      expect(patterns.popularCategories).toContain(InsightCategory.PHYSICAL);
      expect(patterns.popularCategories).toContain(InsightCategory.SLEEP);
    });
  });
}); 