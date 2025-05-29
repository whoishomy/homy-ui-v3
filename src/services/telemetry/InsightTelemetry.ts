import type { HealthInsight } from '@/types/analytics';

export interface TelemetryMetrics {
  timestamp: number;
  duration: number;
  provider: string;
  success: boolean;
  tokenCount?: number;
  cacheHit: boolean;
  errorType?: string;
  insightType?: string;
  category?: string;
}

export interface ProviderMetrics {
  total: number;
  averageDuration: number;
  successRate: number;
  cacheHitRate: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  expired: number;
}

export interface InsightMetrics {
  totalGenerated: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  averageGenerationTime: number;
}

export interface TelemetrySnapshot {
  insights: {
    totalGenerated: number;
    averageDuration: number;
    successRate: number;
    cacheHitRate: number;
    byProvider: Record<string, ProviderMetrics>;
  };
  costs: {
    total: number;
    byProvider: Record<string, number>;
    averagePerInsight: number;
  };
  errors: {
    totalErrors: number;
    byProvider: Record<string, number>;
    byType: Record<string, number>;
  };
  health: {
    vitals: {
      bloodPressure: number;
      heartRate: number;
      bloodOxygen: number;
    };
    activity: {
      steps: number;
      activeMinutes: number;
      caloriesBurned: number;
    };
    sleep: {
      sleepScore: number;
      sleepDuration: number;
      deepSleep: number;
    };
    nutrition: {
      calorieIntake: number;
      waterIntake: number;
      proteinIntake: number;
    };
  };
}

export interface InsightInteractionMetadata {
  tooltipDuration?: number;
  tooltipAction?: string;
  insightType?: string;
  insightPriority?: string;
  viewTimestamp?: number;
  interactionTimestamp?: number;
  actionTimestamp?: number;
}

export interface InsightInteraction {
  insightId: string;
  type: InsightInteractionType;
  timestamp: number;
  metadata: Partial<InsightInteractionMetadata>;
}

export type InsightInteractionType = 'tooltip_shown' | 'tooltip_clicked' | 'tooltip_action_clicked';

export interface InsightMetric {
  timestamp: number;
  duration: number;
  provider: string;
  success: boolean;
  cacheHit: boolean;
  insightType: string;
  cost?: number;
  interactions?: InsightInteraction[];
}

export interface ErrorMetric {
  timestamp: number;
  provider: string;
  error: Error;
  metadata: Record<string, any>;
}

export interface ProviderComparison {
  costComparison: Record<
    string,
    {
      totalCost: number;
      averageCostPerInsight: number;
      costEfficiencyScore: number;
    }
  >;
  performanceComparison: Record<
    string,
    {
      averageLatency: number;
      successRate: number;
      cacheHitRate: number;
      performanceScore: number;
    }
  >;
}

export interface InsightTelemetry {
  recordMetric(metric: InsightMetric): void;
  recordError(error: Error, metadata: Record<string, any>): void;
  getSnapshot(timeRange?: { start: Date; end: Date }): TelemetrySnapshot;
  getProviderComparison(timeRange?: { start: Date; end: Date }): ProviderComparison;
  getErrorStats(timeRange?: { start: Date; end: Date }): {
    totalErrors: number;
    byProvider: Record<string, number>;
    byType: Record<string, number>;
  };
  getInsightUsagePatterns(timeRange?: { start: Date; end: Date }): {
    popularCategories: Array<{ category: string; count: number }>;
    timeDistribution: Record<string, number>;
    userPreferences: Record<string, any>;
  };
}

export interface TelemetryService {
  getSnapshot(): Promise<TelemetrySnapshot>;
  recordInsight(params: {
    provider: string;
    duration: number;
    success: boolean;
    cached: boolean;
    cost: number;
    error?: {
      type: string;
      message: string;
    };
  }): Promise<void>;
  reset(): Promise<void>;
}

export abstract class BaseInsightTelemetry implements InsightTelemetry {
  protected readonly metrics: InsightMetric[] = [];
  protected readonly errors: ErrorMetric[] = [];

  abstract recordMetric(metric: InsightMetric): void;
  abstract recordError(error: Error, metadata: Record<string, any>): void;
  abstract getSnapshot(timeRange?: { start: Date; end: Date }): TelemetrySnapshot;
  abstract getProviderComparison(timeRange?: { start: Date; end: Date }): ProviderComparison;
  abstract getErrorStats(timeRange?: { start: Date; end: Date }): {
    totalErrors: number;
    byProvider: Record<string, number>;
    byType: Record<string, number>;
  };
  abstract getInsightUsagePatterns(timeRange?: { start: Date; end: Date }): {
    popularCategories: Array<{ category: string; count: number }>;
    timeDistribution: Record<string, number>;
    userPreferences: Record<string, any>;
  };

  protected filterByTimeRange<T extends { timestamp: number }>(
    data: T[],
    timeRange?: { start: Date; end: Date }
  ): T[] {
    if (!timeRange) {
      return data;
    }

    const startTime = timeRange.start.getTime();
    const endTime = timeRange.end.getTime();

    return data.filter((item) => {
      return item.timestamp >= startTime && item.timestamp <= endTime;
    });
  }

  protected calculateAverages(metrics: InsightMetric[]): {
    averageDuration: number;
    successRate: number;
    cacheHitRate: number;
  } {
    if (metrics.length === 0) {
      return {
        averageDuration: 0,
        successRate: 0,
        cacheHitRate: 0,
      };
    }

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    const successCount = metrics.filter((m) => m.success).length;
    const cacheHitCount = metrics.filter((m) => m.cacheHit).length;

    return {
      averageDuration: totalDuration / metrics.length,
      successRate: successCount / metrics.length,
      cacheHitRate: cacheHitCount / metrics.length,
    };
  }

  protected calculateCosts(metrics: InsightMetric[]): {
    total: number;
    byProvider: Record<string, number>;
    averagePerInsight: number;
  } {
    const result = {
      total: 0,
      byProvider: {} as Record<string, number>,
      averagePerInsight: 0,
    };

    metrics.forEach((metric) => {
      if (metric.cost) {
        result.total += metric.cost;
        result.byProvider[metric.provider] =
          (result.byProvider[metric.provider] || 0) + metric.cost;
      }
    });

    result.averagePerInsight = metrics.length > 0 ? result.total / metrics.length : 0;

    return result;
  }
}
