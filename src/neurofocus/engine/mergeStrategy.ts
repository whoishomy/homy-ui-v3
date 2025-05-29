import { z } from 'zod';
import type { EmotionalResponse } from '../core/types';

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

export interface MergeOptions {
  priorityBoost?: Partial<Record<InsightSource, number>>;
  timeWindowMs?: number;
  deduplicationThreshold?: number;
  emotionalStateFilter?: EmotionalResponse['type'];
}

export class MergeStrategy {
  private options: Required<MergeOptions>;

  constructor(options: MergeOptions = {}) {
    this.options = {
      priorityBoost: options.priorityBoost || {},
      timeWindowMs: options.timeWindowMs || 24 * 60 * 60 * 1000, // Default: 24 hours
      deduplicationThreshold: options.deduplicationThreshold || 0.8,
      emotionalStateFilter: options.emotionalStateFilter || 'exploring',
    };
  }

  /**
   * Merges insights from different sources with priority handling
   */
  public mergeInsights(insights: InsightData[]): InsightData[] {
    // Validate insights
    const validInsights = insights.filter((insight) => {
      try {
        InsightSchema.parse(insight);
        return true;
      } catch (error) {
        console.warn('Invalid insight data:', error);
        return false;
      }
    });

    // Apply time window filter
    const recentInsights = this.filterByTimeWindow(validInsights);

    // Group similar insights
    const groupedInsights = this.groupSimilarInsights(recentInsights);

    // Merge and prioritize groups
    return this.prioritizeAndMergeGroups(groupedInsights);
  }

  /**
   * Filters insights based on the configured time window
   */
  private filterByTimeWindow(insights: InsightData[]): InsightData[] {
    const cutoffTime = new Date(Date.now() - this.options.timeWindowMs);
    return insights.filter((insight) => new Date(insight.timestamp) >= cutoffTime);
  }

  /**
   * Groups similar insights based on content similarity
   */
  private groupSimilarInsights(insights: InsightData[]): InsightData[][] {
    const groups: InsightData[][] = [];

    for (const insight of insights) {
      let foundGroup = false;
      for (const group of groups) {
        if (this.areSimilar(insight, group[0])) {
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

  /**
   * Checks if two insights are similar based on content
   */
  private areSimilar(a: InsightData, b: InsightData): boolean {
    // Simple text similarity check
    const titleSimilarity = this.calculateStringSimilarity(
      a.content.title.toLowerCase(),
      b.content.title.toLowerCase()
    );

    const descSimilarity = this.calculateStringSimilarity(
      a.content.description.toLowerCase(),
      b.content.description.toLowerCase()
    );

    return (
      titleSimilarity > this.options.deduplicationThreshold ||
      descSimilarity > this.options.deduplicationThreshold
    );
  }

  /**
   * Calculates string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[str1.length][str2.length];
  }

  /**
   * Prioritizes and merges grouped insights
   */
  private prioritizeAndMergeGroups(groups: InsightData[][]): InsightData[] {
    return groups.map((group) => {
      // Sort by priority and boost
      const sortedGroup = group.sort((a, b) => {
        const aPriority = this.calculatePriority(a);
        const bPriority = this.calculatePriority(b);
        return bPriority - aPriority;
      });

      // Take the highest priority insight as base
      const baseInsight = sortedGroup[0];

      // Merge metadata from other insights
      const mergedMetadata = this.mergeMetadata(sortedGroup);

      return {
        ...baseInsight,
        metadata: {
          ...baseInsight.metadata,
          ...mergedMetadata,
        },
      };
    });
  }

  /**
   * Calculates priority score for an insight
   */
  private calculatePriority(insight: InsightData): number {
    const basePriority = SOURCE_PRIORITY[insight.source];
    const boost = this.options.priorityBoost[insight.source] || 0;
    const recencyBoost = this.calculateRecencyBoost(insight.timestamp);
    const confidenceBoost = insight.content.confidence || 0.5;

    return basePriority + boost + recencyBoost + confidenceBoost;
  }

  /**
   * Calculates recency boost based on timestamp
   */
  private calculateRecencyBoost(timestamp: string): number {
    const age = Date.now() - new Date(timestamp).getTime();
    const maxAge = this.options.timeWindowMs;
    return 1 - Math.min(age / maxAge, 1);
  }

  /**
   * Merges metadata from multiple insights
   */
  private mergeMetadata(insights: InsightData[]): InsightMetadata {
    const tags = new Set<string>();
    const relatedTasks = new Set<string>();
    let emotionalContext: InsightMetadata['emotionalContext'];

    for (const insight of insights) {
      if (insight.metadata?.tags) {
        insight.metadata.tags.forEach((tag) => tags.add(tag));
      }
      if (insight.metadata?.relatedTasks) {
        insight.metadata.relatedTasks.forEach((task) => relatedTasks.add(task));
      }
      if (insight.metadata?.emotionalContext && !emotionalContext) {
        emotionalContext = insight.metadata.emotionalContext;
      }
    }

    return {
      tags: Array.from(tags),
      relatedTasks: Array.from(relatedTasks),
      emotionalContext,
    };
  }
}

// Export singleton instance
export const mergeStrategy = new MergeStrategy();
