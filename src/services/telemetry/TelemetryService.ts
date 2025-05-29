import type { TelemetryService, TelemetrySnapshot } from './InsightTelemetry';

export class InMemoryTelemetryService implements TelemetryService {
  private insights: {
    provider: string;
    duration: number;
    success: boolean;
    cached: boolean;
    cost: number;
    error?: {
      type: string;
      message: string;
    };
    timestamp: Date;
  }[] = [];

  async getSnapshot(): Promise<TelemetrySnapshot> {
    const totalGenerated = this.insights.length;
    const successfulInsights = this.insights.filter((i) => i.success);
    const cachedInsights = this.insights.filter((i) => i.cached);
    const totalDuration = this.insights.reduce((sum, i) => sum + i.duration, 0);
    const totalCost = this.insights.reduce((sum, i) => sum + i.cost, 0);

    // Group by provider
    const byProvider = this.insights.reduce(
      (acc, insight) => {
        const provider = insight.provider;
        if (!acc[provider]) {
          acc[provider] = {
            total: 0,
            successCount: 0,
            cacheCount: 0,
            totalDuration: 0,
          };
        }
        acc[provider].total++;
        if (insight.success) acc[provider].successCount++;
        if (insight.cached) acc[provider].cacheCount++;
        acc[provider].totalDuration += insight.duration;
        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          successCount: number;
          cacheCount: number;
          totalDuration: number;
        }
      >
    );

    // Group costs by provider
    const costsByProvider = this.insights.reduce(
      (acc, insight) => {
        const provider = insight.provider;
        acc[provider] = (acc[provider] || 0) + insight.cost;
        return acc;
      },
      {} as Record<string, number>
    );

    // Group errors by provider and type
    const errorsByProvider: Record<string, number> = {};
    const errorsByType: Record<string, number> = {};
    this.insights
      .filter((i) => !i.success)
      .forEach((insight) => {
        const provider = insight.provider;
        errorsByProvider[provider] = (errorsByProvider[provider] || 0) + 1;
        if (insight.error?.type) {
          errorsByType[insight.error.type] = (errorsByType[insight.error.type] || 0) + 1;
        }
      });

    return {
      insights: {
        totalGenerated,
        averageDuration: totalDuration / totalGenerated,
        successRate: successfulInsights.length / totalGenerated,
        cacheHitRate: cachedInsights.length / totalGenerated,
        byProvider: Object.entries(byProvider).reduce(
          (acc, [provider, stats]) => {
            acc[provider] = {
              total: stats.total,
              averageDuration: stats.totalDuration / stats.total,
              successRate: stats.successCount / stats.total,
              cacheHitRate: stats.cacheCount / stats.total,
            };
            return acc;
          },
          {} as Record<
            string,
            {
              total: number;
              averageDuration: number;
              successRate: number;
              cacheHitRate: number;
            }
          >
        ),
      },
      costs: {
        total: totalCost,
        byProvider: costsByProvider,
        averagePerInsight: totalCost / totalGenerated,
      },
      errors: {
        totalErrors: this.insights.filter((i) => !i.success).length,
        byProvider: errorsByProvider,
        byType: errorsByType,
      },
      health: {
        vitals: {
          bloodPressure: 120,
          heartRate: 72,
          bloodOxygen: 98,
        },
        activity: {
          steps: 8500,
          activeMinutes: 45,
          caloriesBurned: 2100,
        },
        sleep: {
          sleepScore: 85,
          sleepDuration: 7.5,
          deepSleep: 2.3,
        },
        nutrition: {
          calorieIntake: 2200,
          waterIntake: 2.5,
          proteinIntake: 75,
        },
      },
    };
  }

  async recordInsight(params: {
    provider: string;
    duration: number;
    success: boolean;
    cached: boolean;
    cost: number;
    error?: {
      type: string;
      message: string;
    };
  }): Promise<void> {
    this.insights.push({
      ...params,
      timestamp: new Date(),
    });
  }

  async reset(): Promise<void> {
    this.insights = [];
  }
}
