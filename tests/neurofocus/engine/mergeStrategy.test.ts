import { MergeStrategy } from '@/neurofocus/engine/mergeStrategy';
import { Insight } from '@/types/Insight';

describe('MergeStrategy', () => {
  describe('mergeInsights', () => {
    it('should merge similar insights from different sources', () => {
      const insights: Insight[] = [
        {
          id: '1',
          category: 'performance',
          source: 'clinical',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          metadata: {
            tags: ['tag-clinical'],
          },
        },
        {
          id: '2',
          category: 'performance',
          source: 'ai',
          priority: 2,
          confidence: 0.9,
          timestamp: new Date().toISOString(),
          metadata: {
            tags: ['tag-ai'],
          },
        },
        {
          id: '3',
          category: 'performance',
          source: 'manual',
          priority: 3,
          confidence: 0.7,
          timestamp: new Date().toISOString(),
          metadata: {
            tags: ['tag-manual'],
          },
        },
      ];

      const mergeStrategy = new MergeStrategy();
      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].source).toBe('manual'); // Should pick highest priority source
      expect(merged[0].metadata?.tags).toContain('tag-ai');
      expect(merged[0].metadata?.tags).toContain('tag-clinical');
      expect(merged[0].metadata?.tags).toContain('tag-manual');
    });

    it('should handle custom priority boosts', () => {
      const insights: Insight[] = [
        {
          id: '1',
          category: 'performance',
          source: 'ai',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          category: 'performance',
          source: 'manual',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
        },
      ];

      const mergeStrategy = new MergeStrategy({
        priorityBoosts: {
          manual: 2,
        },
      });

      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].source).toBe('manual'); // Should be first due to boost
    });

    it('should not merge insights from different categories', () => {
      const insights: Insight[] = [
        {
          id: '1',
          category: 'performance',
          source: 'ai',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          category: 'security',
          source: 'manual',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
        },
      ];

      const mergeStrategy = new MergeStrategy();
      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(2);
    });

    it('should merge metadata from multiple insights', () => {
      const insights: Insight[] = [
        {
          id: '1',
          category: 'performance',
          source: 'ai',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          metadata: {
            tags: ['tag1', 'tag2'],
          },
        },
        {
          id: '2',
          category: 'performance',
          source: 'manual',
          priority: 1,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          metadata: {
            tags: ['tag2', 'tag3'],
          },
        },
      ];

      const mergeStrategy = new MergeStrategy();
      const merged = mergeStrategy.mergeInsights(insights);

      expect(merged).toHaveLength(1);
      expect(merged[0].metadata?.tags).toHaveLength(3);
      expect(merged[0].metadata?.tags).toContain('tag1');
      expect(merged[0].metadata?.tags).toContain('tag2');
      expect(merged[0].metadata?.tags).toContain('tag3');
    });
  });
});
