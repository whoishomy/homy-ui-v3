import { describe, it, expect, beforeEach } from 'vitest';
import { MergeStrategy, type InsightData } from '../mergeStrategy';

describe('MergeStrategy', () => {
  let mergeStrategy: MergeStrategy;

  beforeEach(() => {
    mergeStrategy = new MergeStrategy();
  });

  const createMockInsight = (
    source: InsightData['source'],
    title: string,
    description: string,
    timestamp: string = new Date().toISOString()
  ): InsightData => ({
    id: `test-${source}-${Date.now()}`,
    source,
    timestamp,
    content: {
      title,
      description,
      type: 'note',
    },
    metadata: {
      tags: [`tag-${source}`],
      relatedTasks: [`task-${source}`],
      emotionalContext: {
        type: 'exploring',
        intensity: 0.5,
      },
    },
  });

  describe('mergeInsights', () => {
    it('should merge similar insights from different sources', () => {
      const insights: InsightData[] = [
        createMockInsight('ai', 'Low Vitamin D', 'Vitamin D levels are below normal'),
        createMockInsight('clinical', 'Vitamin D Deficiency', 'Patient shows low vitamin D levels'),
        createMockInsight('manual', 'Vitamin D Status', 'Vitamin D needs attention'),
      ];

      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].source).toBe('clinical'); // Should pick highest priority source
      expect(merged[0].metadata?.tags).toContain('tag-ai');
      expect(merged[0].metadata?.tags).toContain('tag-clinical');
      expect(merged[0].metadata?.tags).toContain('tag-manual');
    });

    it('should keep distinct insights separate', () => {
      const insights: InsightData[] = [
        createMockInsight('ai', 'Low Vitamin D', 'Vitamin D levels are below normal'),
        createMockInsight('clinical', 'High Blood Pressure', 'Blood pressure is elevated'),
      ];

      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(2);
      expect(merged.map((i) => i.content.title)).toContain('High Blood Pressure');
      expect(merged.map((i) => i.content.title)).toContain('Low Vitamin D');
    });

    it('should filter out insights outside the time window', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

      const insights: InsightData[] = [
        createMockInsight('ai', 'Recent Insight', 'Recent data', now.toISOString()),
        createMockInsight('clinical', 'Old Insight', 'Old data', oldDate.toISOString()),
      ];

      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].content.title).toBe('Recent Insight');
    });

    it('should handle custom priority boosts', () => {
      const mergeStrategyWithBoost = new MergeStrategy({
        priorityBoost: {
          manual: 5, // Boost manual insights
        },
      });

      const insights: InsightData[] = [
        createMockInsight('ai', 'AI Insight', 'AI generated data'),
        createMockInsight('manual', 'Manual Insight', 'Manually entered data'),
      ];

      const merged = mergeStrategyWithBoost.mergeInsights(insights);

      expect(merged).toHaveLength(2);
      expect(merged[0].source).toBe('manual'); // Should be first due to boost
    });

    it('should validate insights and filter out invalid ones', () => {
      const validInsight = createMockInsight('ai', 'Valid Insight', 'Valid data');
      const invalidInsight = {
        id: 'invalid',
        source: 'invalid' as InsightData['source'],
        timestamp: new Date().toISOString(),
        content: {
          title: '',
          description: '',
          type: 'note' as const,
        },
      };

      const merged = mergeStrategy.mergeInsights([validInsight, invalidInsight]);

      expect(merged).toHaveLength(1);
      expect(merged[0].content.title).toBe('Valid Insight');
    });

    it('should merge metadata from multiple insights', () => {
      const insights: InsightData[] = [
        {
          ...createMockInsight('ai', 'Insight', 'Data'),
          metadata: {
            tags: ['tag1', 'tag2'],
            relatedTasks: ['task1'],
            emotionalContext: {
              type: 'curious',
              intensity: 0.7,
            },
          },
        },
        {
          ...createMockInsight('clinical', 'Similar Insight', 'Similar Data'),
          metadata: {
            tags: ['tag2', 'tag3'],
            relatedTasks: ['task2'],
            emotionalContext: {
              type: 'determined',
              intensity: 0.8,
            },
          },
        },
      ];

      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].metadata?.tags).toHaveLength(3);
      expect(merged[0].metadata?.tags).toContain('tag1');
      expect(merged[0].metadata?.tags).toContain('tag2');
      expect(merged[0].metadata?.tags).toContain('tag3');
      expect(merged[0].metadata?.relatedTasks).toHaveLength(2);
      // Should keep the emotional context from the highest priority insight
      expect(merged[0].metadata?.emotionalContext?.type).toBe('determined');
    });
  });
});
