import { z } from 'zod';
import type { EmotionalResponse } from '../core/types';
import { Insight } from '@/types/Insight';

// Source types for insights
export type InsightSource = 'ai' | 'manual' | 'clinical' | 'system' | 'user';

// Priority levels for different sources
const SOURCE_PRIORITY: Record<InsightSource, number> = {
  clinical: 5, // Highest priority - clinical/medical insights
  ai: 4, // AI-generated insights
  manual: 3, // Manually entered insights
  system: 2, // System-generated insights
  user: 1, // User-generated insights
};

// Schema for insight data validation
export const InsightSchema = z.object({
  id: z.string(),
  source: z.enum(['ai', 'manual', 'clinical', 'system', 'user']),
  timestamp: z.string().datetime(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['risk', 'trend', 'note', 'achievement']),
    severity: z.number().min(0).max(1).optional(),
    confidence: z.number().min(0).max(1).optional(),
  }),
  metadata: z
    .object({
      emotionalContext: z
        .object({
          type: z.enum([
            'exploring',
            'frustrated',
            'overwhelmed',
            'discouraged',
            'tired',
            'proud',
            'curious',
            'determined',
          ]),
          intensity: z.number().min(0).max(1),
        })
        .optional(),
      relatedTasks: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

export type InsightData = z.infer<typeof InsightSchema>;

// Define metadata type separately for better type inference
export type InsightMetadata = NonNullable<InsightData['metadata']>;

interface MergeStrategyOptions {
  priorityBoosts?: Record<string, number>;
}

export class MergeStrategy {
  private readonly priorityBoosts: Record<string, number>;

  constructor(options: MergeStrategyOptions = {}) {
    this.priorityBoosts = options.priorityBoosts || {};
  }

  mergeInsights(insights: Insight[]): Insight[] {
    if (!insights.length) return [];

    // Group similar insights
    const groups = this.groupSimilarInsights(insights);

    // Merge each group into a single insight
    return groups.map((group) => this.mergeGroup(group));
  }

  private groupSimilarInsights(insights: Insight[]): Insight[][] {
    const groups: Insight[][] = [];

    for (const insight of insights) {
      let foundGroup = false;

      for (const group of groups) {
        if (this.areSimilar(group[0], insight)) {
          group.push(insight);
          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        groups.push([insight]);
      }
    }

    return groups;
  }

  private areSimilar(a: Insight, b: Insight): boolean {
    // Consider insights similar if they have:
    // 1. Same category
    // 2. Similar confidence (within 20%)
    // 3. Similar timestamp (within 24 hours)
    return (
      a.category === b.category &&
      Math.abs(a.confidence - b.confidence) <= 0.2 &&
      Math.abs(new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) <= 86400000
    );
  }

  private mergeGroup(group: Insight[]): Insight {
    // Sort by priority (including boosts)
    const sortedGroup = [...group].sort((a, b) => {
      const aBoost = this.priorityBoosts[a.source] || 0;
      const bBoost = this.priorityBoosts[b.source] || 0;
      return b.priority + bBoost - (a.priority + aBoost);
    });

    // Take the highest priority insight as base
    const base = sortedGroup[0];

    // Merge metadata from all insights
    const mergedMetadata = {
      tags: new Set<string>(),
      sources: new Set<string>(),
      confidence: 0,
    };

    for (const insight of sortedGroup) {
      if (insight.metadata?.tags) {
        insight.metadata.tags.forEach((tag) => mergedMetadata.tags.add(tag));
      }
      mergedMetadata.sources.add(insight.source);
      mergedMetadata.confidence += insight.confidence / sortedGroup.length;
    }

    return {
      ...base,
      metadata: {
        ...base.metadata,
        tags: Array.from(mergedMetadata.tags),
        sources: Array.from(mergedMetadata.sources),
        confidence: mergedMetadata.confidence,
      },
    };
  }
}

// Export singleton instance
export const mergeStrategy = new MergeStrategy();
