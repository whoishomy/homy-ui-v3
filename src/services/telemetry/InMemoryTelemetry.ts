import type { InsightCache } from '../cache/InsightCache';
import {
  BaseInsightTelemetry,
  type InsightMetric,
  type TelemetrySnapshot,
  type ProviderComparison,
} from './InsightTelemetry';

interface InMemoryTelemetryConfig {
  maxMetrics?: number;
  cache?: InsightCache;
}

export class InMemoryTelemetry extends BaseInsightTelemetry {
  private readonly maxMetrics: number;
  private readonly cache?: InsightCache;

  constructor(config: InMemoryTelemetryConfig = {}) {
    super();
    this.maxMetrics = config.maxMetrics ?? 10000;
    this.cache = config.cache;
  }

  recordMetric(metric: InsightMetric): void {
    if (this.metrics.length >= this.maxMetrics) {
      this.metrics.shift(); // Remove oldest metric
    }
    this.metrics.push(metric);
  }

  recordError(error: Error, metadata: Record<string, any>): void {
    this.errors.push({
      timestamp: Date.now(),
      provider: metadata.provider,
      error,
      metadata,
    });
  }

  getSnapshot(timeRange?: { start: Date; end: Date }): TelemetrySnapshot {
    const filteredMetrics = this.filterByTimeRange(this.metrics, timeRange);
    const averages = this.calculateAverages(filteredMetrics);
    const costs = this.calculateCosts(filteredMetrics);

    // Calculate per-provider metrics
    const byProvider: Record<
      string,
      {
        total: number;
        averageDuration: number;
        successRate: number;
        cacheHitRate: number;
      }
    > = {};

    filteredMetrics.forEach((metric) => {
      if (!byProvider[metric.provider]) {
        byProvider[metric.provider] = {
          total: 0,
          averageDuration: 0,
          successRate: 0,
          cacheHitRate: 0,
        };
      }

      const provider = byProvider[metric.provider];
      provider.total++;
      provider.averageDuration =
        (provider.averageDuration * (provider.total - 1) + metric.duration) / provider.total;
      provider.successRate =
        (provider.successRate * (provider.total - 1) + (metric.success ? 1 : 0)) / provider.total;
      provider.cacheHitRate =
        (provider.cacheHitRate * (provider.total - 1) + (metric.cacheHit ? 1 : 0)) / provider.total;
    });

    // Calculate error statistics
    const errorStats = this.getErrorStats(timeRange);

    return {
      insights: {
        totalGenerated: filteredMetrics.length,
        averageDuration: averages.averageDuration,
        successRate: averages.successRate,
        cacheHitRate: averages.cacheHitRate,
        byProvider,
      },
      errors: errorStats,
      costs,
      health: {
        vitals: {
          bloodPressure: 0,
          heartRate: 0,
          bloodOxygen: 0,
        },
        activity: {
          steps: 0,
          activeMinutes: 0,
          caloriesBurned: 0,
        },
        sleep: {
          sleepDuration: 0,
          sleepScore: 0,
          deepSleep: 0,
        },
        nutrition: {
          calorieIntake: 0,
          waterIntake: 0,
          proteinIntake: 0,
        },
      },
    };
  }

  getProviderComparison(timeRange?: { start: Date; end: Date }): ProviderComparison {
    const filteredMetrics = this.filterByTimeRange(this.metrics, timeRange);
    const providerMetrics: Record<string, InsightMetric[]> = {};

    // Group metrics by provider
    filteredMetrics.forEach((metric) => {
      if (!providerMetrics[metric.provider]) {
        providerMetrics[metric.provider] = [];
      }
      providerMetrics[metric.provider].push(metric);
    });

    const costComparison: Record<
      string,
      {
        totalCost: number;
        averageCostPerInsight: number;
        costEfficiencyScore: number;
      }
    > = {};

    const performanceComparison: Record<
      string,
      {
        averageLatency: number;
        successRate: number;
        cacheHitRate: number;
        performanceScore: number;
      }
    > = {};

    // Calculate metrics for each provider
    Object.entries(providerMetrics).forEach(([provider, metrics]) => {
      const averages = this.calculateAverages(metrics);
      const costs = this.calculateCosts(metrics);

      costComparison[provider] = {
        totalCost: costs.total,
        averageCostPerInsight: costs.averagePerInsight,
        costEfficiencyScore: averages.successRate / (costs.averagePerInsight || 1),
      };

      performanceComparison[provider] = {
        averageLatency: averages.averageDuration,
        successRate: averages.successRate,
        cacheHitRate: averages.cacheHitRate,
        performanceScore:
          averages.successRate * 0.4 +
          averages.cacheHitRate * 0.3 +
          (1 - averages.averageDuration / 10000) * 0.3,
      };
    });

    return {
      costComparison,
      performanceComparison,
    };
  }

  getErrorStats(timeRange?: { start: Date; end: Date }): {
    totalErrors: number;
    byProvider: Record<string, number>;
    byType: Record<string, number>;
  } {
    const filteredErrors = this.filterByTimeRange(this.errors, timeRange);
    const byProvider: Record<string, number> = {};
    const byType: Record<string, number> = {};

    filteredErrors.forEach((error) => {
      byProvider[error.provider] = (byProvider[error.provider] || 0) + 1;
      const errorType = error.error.name || 'UnknownError';
      byType[errorType] = (byType[errorType] || 0) + 1;
    });

    return {
      totalErrors: filteredErrors.length,
      byProvider,
      byType,
    };
  }

  getInsightUsagePatterns(timeRange?: { start: Date; end: Date }): {
    popularCategories: Array<{ category: string; count: number }>;
    timeDistribution: Record<string, number>;
    userPreferences: Record<string, any>;
  } {
    const filteredMetrics = this.filterByTimeRange(this.metrics, timeRange);
    const categories: Record<string, number> = {};
    const hourDistribution: Record<string, number> = {};
    const preferences: Record<string, any> = {};

    filteredMetrics.forEach((metric) => {
      // Track categories
      if (metric.insightType) {
        categories[metric.insightType] = (categories[metric.insightType] || 0) + 1;
      }

      // Track time distribution
      const hour = new Date(metric.timestamp).getHours();
      hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;

      // Track user preferences (e.g., provider choice, cache usage)
      preferences[metric.provider] = (preferences[metric.provider] || 0) + 1;
      if (metric.cacheHit) {
        preferences.cacheUsage = (preferences.cacheUsage || 0) + 1;
      }
    });

    // Sort categories by popularity
    const popularCategories = Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      popularCategories,
      timeDistribution: hourDistribution,
      userPreferences: preferences,
    };
  }
}
