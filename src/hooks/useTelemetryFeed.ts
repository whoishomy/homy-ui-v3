import { useState, useEffect } from 'react';
import { InsightEngine } from '@/services/insightEngine';
import type { ProviderMetrics } from '@/services/telemetry/InsightTelemetry';

export interface TelemetrySnapshot {
  providers: {
    [key: string]: {
      health: number;
      latency: number;
      errorRate: number;
      successRate: number;
      totalRequests: number;
    };
  };
  errorTimeline: Array<{
    timestamp: number;
    errors: number;
  }>;
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
}

interface UseTelemetryFeedOptions {
  refreshInterval?: number;
  provider?: string;
}

interface UseTelemetryFeedResult {
  snapshot: TelemetrySnapshot;
  error: Error | null;
  isLoading: boolean;
}

export function useTelemetryFeed({
  refreshInterval = 5000,
  provider,
}: UseTelemetryFeedOptions = {}): UseTelemetryFeedResult {
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot>({
    providers: {},
    errorTimeline: [],
    insights: {
      totalGenerated: 0,
      averageDuration: 0,
      successRate: 0,
      cacheHitRate: 0,
      byProvider: {},
    },
    costs: {
      total: 0,
      byProvider: {},
      averagePerInsight: 0,
    },
    errors: {
      totalErrors: 0,
      byProvider: {},
      byType: {},
    },
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        const engine = InsightEngine.getInstance();
        const health = engine.getProviderHealth();
        const telemetry = engine.getTelemetrySnapshot();
        const errorStats = engine.getErrorStats();

        if (!isMounted) return;

        const newSnapshot: TelemetrySnapshot = {
          providers: {},
          errorTimeline: errorStats.timeline.map((entry) => ({
            timestamp: entry.timestamp,
            errors: entry.count,
          })),
          insights: {
            totalGenerated: telemetry.insights.totalGenerated,
            averageDuration: telemetry.insights.averageLatency,
            successRate: 0, // Will be calculated from provider stats
            cacheHitRate: telemetry.cache.hitRate,
            byProvider: {},
          },
          costs: {
            total: 0,
            byProvider: {},
            averagePerInsight: 0,
          },
          errors: {
            totalErrors: 0,
            byProvider: {},
            byType: {},
          },
        };

        // Add provider-specific metrics
        Object.entries(health).forEach(([providerKey, metrics]) => {
          if (!provider || provider === providerKey) {
            newSnapshot.providers[providerKey] = {
              health: metrics.healthScore,
              latency: metrics.averageLatency,
              errorRate: metrics.errorRate,
              successRate: metrics.successRate,
              totalRequests: metrics.totalRequests,
            };

            // Calculate overall success rate from provider metrics
            const totalRequests = Object.values(newSnapshot.providers).reduce(
              (sum, p) => sum + p.totalRequests,
              0
            );
            const successfulRequests = Object.values(newSnapshot.providers).reduce(
              (sum, p) => sum + p.successRate * p.totalRequests,
              0
            );
            newSnapshot.insights.successRate =
              totalRequests > 0 ? successfulRequests / totalRequests : 0;
          }
        });

        setSnapshot(newSnapshot);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch telemetry'));
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshInterval, provider]);

  return { snapshot, error, isLoading };
}
