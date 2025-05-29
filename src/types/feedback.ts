import type { HealthInsight } from './analytics';

export type FeedbackScore = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory = 
  | 'ACCURACY'     // How accurate was the insight?
  | 'USEFULNESS'   // How useful was this insight for the user?
  | 'CLARITY'      // How clear was the insight's message?
  | 'ACTIONABILITY'; // How actionable was the insight?

export type FeedbackSource = 
  | 'USER_EXPLICIT'    // Direct user feedback
  | 'USER_IMPLICIT'    // Derived from user behavior
  | 'SYSTEM_AUTO'      // Automatically generated
  | 'EXPERT_REVIEW';   // Healthcare professional review

export interface InsightFeedbackAnnotations {
  tags: string[];
  sentimentScore?: number;       // -1 to 1
  contentQualityMetrics?: {
    relevance: number;           // 0 to 1
    specificity: number;         // 0 to 1
    actionability: number;       // 0 to 1
  };
}

export interface InsightFeedback {
  id: string;
  insightId: string;
  insight: HealthInsight;
  score: FeedbackScore;
  category: FeedbackCategory;
  source: FeedbackSource;
  comment?: string;
  metadata: {
    timestamp: Date;
    sessionId: string;
    userId: string;
    deviceInfo?: string;
    interactionContext?: {
      timeSpentViewing?: number;    // milliseconds
      clickedActions?: string[];    // IDs of actions taken
      expanded?: boolean;           // Whether user expanded for more detail
      shared?: boolean;             // Whether insight was shared
    };
  };
  annotations?: InsightFeedbackAnnotations;
}

export interface FeedbackStats {
  insightId: string;
  averageScore: number;
  scoreDistribution: Record<FeedbackScore, number>;
  totalFeedbackCount: number;
  categoryBreakdown: Record<FeedbackCategory, number>;
  userSentiment: number;           // -1 to 1
  commonTags: string[];
  performanceMetrics: {
    averageViewTime: number;
    actionClickRate: number;
    expansionRate: number;
    shareRate: number;
  };
}

export interface FeedbackAggregator {
  addFeedback(feedback: Omit<InsightFeedback, 'id'>): Promise<void>;
  getFeedbackStats(insightId: string): Promise<FeedbackStats>;
  getInsightFeedback(insightId: string): Promise<InsightFeedback[]>;
  getUserFeedbackHistory(userId: string): Promise<InsightFeedback[]>;
  updateAnnotations(feedbackId: string, annotations: Partial<InsightFeedbackAnnotations>): Promise<void>;
} 