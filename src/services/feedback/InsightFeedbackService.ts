import { v4 as uuidv4 } from 'uuid';
import type {
  InsightFeedback,
  FeedbackStats,
  FeedbackScore,
  FeedbackCategory,
  FeedbackAggregator,
  InsightFeedbackAnnotations
} from '@/types/feedback';

export class InsightFeedbackService implements FeedbackAggregator {
  private feedbackStore: Map<string, InsightFeedback> = new Map();
  private insightIndex: Map<string, Set<string>> = new Map(); // insightId -> Set<feedbackId>
  private userIndex: Map<string, Set<string>> = new Map();    // userId -> Set<feedbackId>

  async addFeedback(feedback: Omit<InsightFeedback, 'id'>): Promise<void> {
    const feedbackId = uuidv4();
    const fullFeedback: InsightFeedback = {
      ...feedback,
      id: feedbackId,
      metadata: {
        ...feedback.metadata,
        timestamp: new Date(),
      }
    };

    // Store feedback
    this.feedbackStore.set(feedbackId, fullFeedback);

    // Update indices
    this.updateInsightIndex(fullFeedback.insightId, feedbackId);
    this.updateUserIndex(fullFeedback.metadata.userId, feedbackId);

    // Trigger async processing
    await this.processFeedback(fullFeedback);
  }

  async getFeedbackStats(insightId: string): Promise<FeedbackStats> {
    const feedbackIds = this.insightIndex.get(insightId) || new Set();
    const feedbacks = Array.from(feedbackIds)
      .map(id => this.feedbackStore.get(id))
      .filter((f): f is InsightFeedback => f !== undefined);

    return this.calculateStats(feedbacks);
  }

  async getInsightFeedback(insightId: string): Promise<InsightFeedback[]> {
    const feedbackIds = this.insightIndex.get(insightId) || new Set();
    return Array.from(feedbackIds)
      .map(id => this.feedbackStore.get(id))
      .filter((f): f is InsightFeedback => f !== undefined);
  }

  async getUserFeedbackHistory(userId: string): Promise<InsightFeedback[]> {
    const feedbackIds = this.userIndex.get(userId) || new Set();
    return Array.from(feedbackIds)
      .map(id => this.feedbackStore.get(id))
      .filter((f): f is InsightFeedback => f !== undefined);
  }

  async updateAnnotations(
    feedbackId: string,
    annotations: Partial<InsightFeedbackAnnotations>
  ): Promise<void> {
    const feedback = this.feedbackStore.get(feedbackId);
    if (!feedback) {
      throw new Error(`Feedback not found: ${feedbackId}`);
    }

    const updatedFeedback = {
      ...feedback,
      annotations: {
        tags: feedback.annotations?.tags || [],
        ...feedback.annotations,
        ...annotations,
      }
    };

    this.feedbackStore.set(feedbackId, updatedFeedback);
  }

  private updateInsightIndex(insightId: string, feedbackId: string): void {
    if (!this.insightIndex.has(insightId)) {
      this.insightIndex.set(insightId, new Set());
    }
    this.insightIndex.get(insightId)!.add(feedbackId);
  }

  private updateUserIndex(userId: string, feedbackId: string): void {
    if (!this.userIndex.has(userId)) {
      this.userIndex.set(userId, new Set());
    }
    this.userIndex.get(userId)!.add(feedbackId);
  }

  private async processFeedback(feedback: InsightFeedback): Promise<void> {
    const baseAnnotations: InsightFeedbackAnnotations = {
      tags: feedback.annotations?.tags || [],
      ...feedback.annotations
    };

    // Calculate sentiment score if not provided
    if (!baseAnnotations.sentimentScore && feedback.comment) {
      const sentimentScore = await this.analyzeSentiment(feedback.comment);
      await this.updateAnnotations(feedback.id, {
        sentimentScore,
      });
    }

    // Extract and update tags if needed
    if (!baseAnnotations.tags.length && feedback.comment) {
      const tags = await this.extractTags(feedback.comment);
      await this.updateAnnotations(feedback.id, {
        tags,
      });
    }

    // Calculate content quality metrics if not provided
    if (!baseAnnotations.contentQualityMetrics) {
      const metrics = await this.calculateContentQuality(feedback);
      await this.updateAnnotations(feedback.id, {
        contentQualityMetrics: metrics,
      });
    }
  }

  private calculateStats(feedbacks: InsightFeedback[]): FeedbackStats {
    if (!feedbacks.length) {
      return this.getEmptyStats(feedbacks[0]?.insightId || '');
    }

    const scoreDistribution = this.calculateScoreDistribution(feedbacks);
    const categoryBreakdown = this.calculateCategoryBreakdown(feedbacks);
    const performanceMetrics = this.calculatePerformanceMetrics(feedbacks);

    return {
      insightId: feedbacks[0].insightId,
      averageScore: this.calculateAverageScore(feedbacks),
      scoreDistribution,
      totalFeedbackCount: feedbacks.length,
      categoryBreakdown,
      userSentiment: this.calculateAverageSentiment(feedbacks),
      commonTags: this.extractCommonTags(feedbacks),
      performanceMetrics,
    };
  }

  private getEmptyStats(insightId: string): FeedbackStats {
    return {
      insightId,
      averageScore: 0,
      scoreDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      },
      totalFeedbackCount: 0,
      categoryBreakdown: {
        ACCURACY: 0,
        USEFULNESS: 0,
        CLARITY: 0,
        ACTIONABILITY: 0
      },
      userSentiment: 0,
      commonTags: [],
      performanceMetrics: {
        averageViewTime: 0,
        actionClickRate: 0,
        expansionRate: 0,
        shareRate: 0
      }
    };
  }

  private calculateScoreDistribution(
    feedbacks: InsightFeedback[]
  ): Record<FeedbackScore, number> {
    const distribution: Record<FeedbackScore, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    feedbacks.forEach(f => distribution[f.score]++);
    return distribution;
  }

  private calculateCategoryBreakdown(
    feedbacks: InsightFeedback[]
  ): Record<FeedbackCategory, number> {
    const breakdown: Record<FeedbackCategory, number> = {
      ACCURACY: 0,
      USEFULNESS: 0,
      CLARITY: 0,
      ACTIONABILITY: 0
    };
    
    feedbacks.forEach(f => breakdown[f.category]++);
    return breakdown;
  }

  private calculateAverageScore(feedbacks: InsightFeedback[]): number {
    const sum = feedbacks.reduce((acc, f) => acc + f.score, 0);
    return sum / feedbacks.length;
  }

  private calculateAverageSentiment(feedbacks: InsightFeedback[]): number {
    const sentiments = feedbacks
      .map(f => f.annotations?.sentimentScore)
      .filter((s): s is number => s !== undefined);
    
    if (!sentiments.length) return 0;
    return sentiments.reduce((acc, s) => acc + s, 0) / sentiments.length;
  }

  private extractCommonTags(feedbacks: InsightFeedback[]): string[] {
    const tagCounts = new Map<string, number>();
    
    feedbacks.forEach(f => {
      f.annotations?.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }

  private calculatePerformanceMetrics(
    feedbacks: InsightFeedback[]
  ): FeedbackStats['performanceMetrics'] {
    const metrics = feedbacks
      .map(f => f.metadata.interactionContext)
      .filter((m): m is NonNullable<typeof m> => m !== undefined);

    if (!metrics.length) {
      return {
        averageViewTime: 0,
        actionClickRate: 0,
        expansionRate: 0,
        shareRate: 0
      };
    }

    return {
      averageViewTime: this.average(metrics.map(m => m.timeSpentViewing || 0)),
      actionClickRate: this.calculateRate(metrics, m => (m.clickedActions?.length || 0) > 0),
      expansionRate: this.calculateRate(metrics, m => m.expanded || false),
      shareRate: this.calculateRate(metrics, m => m.shared || false)
    };
  }

  private average(numbers: number[]): number {
    return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
  }

  private calculateRate(
    items: any[],
    predicate: (item: any) => boolean
  ): number {
    return items.length ? items.filter(predicate).length / items.length : 0;
  }

  // These methods would be implemented with actual NLP/ML services
  private async analyzeSentiment(text: string): Promise<number> {
    // TODO: Implement sentiment analysis
    return 0;
  }

  private async extractTags(text: string): Promise<string[]> {
    // TODO: Implement tag extraction
    return [];
  }

  private async calculateContentQuality(
    feedback: InsightFeedback
  ): Promise<NonNullable<InsightFeedbackAnnotations>['contentQualityMetrics']> {
    // TODO: Implement content quality analysis
    return {
      relevance: 0,
      specificity: 0,
      actionability: 0
    };
  }
} 