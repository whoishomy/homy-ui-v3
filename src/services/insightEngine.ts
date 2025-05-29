import type { HealthInsight } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';
import { ProviderConfig } from './types';
import { InsightCategory } from '@/types/analytics';

interface InsightEngineConfig {
  openAIKey: string;
  anthropicKey: string;
  cacheTTL: number;
  maxMetrics: number;
  retry: {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  };
  circuitBreaker: {
    failureThreshold: number;
    resetTimeoutMs: number;
    halfOpenMaxAttempts: number;
  };
}

interface InsightMetrics {
  [key: string]: number;
}

interface InsightRequest {
  category: InsightCategory;
  metrics: InsightMetrics;
}

interface PersonaInsightRequest extends InsightRequest {
  persona: {
    id: string;
    age: number;
    gender: string;
    conditions: string[];
    preferences: {
      activityLevel: string;
      [key: string]: any;
    };
    culturalContext: {
      country: string;
      language: string;
    };
  };
}

interface TelemetrySnapshot {
  insights: {
    totalGenerated: number;
    [key: string]: any;
  };
  providers: {
    [key: string]: {
      health: number;
      latency: number;
      errorRate: number;
    };
  };
  cache: {
    hits: number;
    misses: number;
    size: number;
  };
}

interface ProviderComparison {
  costComparison: {
    [provider: string]: number;
  };
  performanceComparison: {
    [provider: string]: {
      latency: number;
      reliability: number;
    };
  };
}

interface UsagePatterns {
  popularCategories: string[];
  timeDistribution: {
    [hour: string]: number;
  };
}

export interface ProviderHealthMetrics {
  healthScore: number;
  averageLatency: number;
  errorRate: number;
  successRate: number;
  totalRequests: number;
}

export interface TelemetryMetrics {
  insights: {
    totalGenerated: number;
    averageLatency: number;
    cacheHitRate: number;
  };
  cache: {
    hitRate: number;
  };
}

export interface ErrorStats {
  timeline: Array<{
    timestamp: number;
    count: number;
  }>;
}

export class InsightEngine {
  private static instance: InsightEngine | null = null;
  private config: ProviderConfig;
  private insights: HealthInsight[] = [];
  private errorCount: number = 0;
  private lastErrorTime: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private insightCache: Map<string, HealthInsight> = new Map();
  private providerStats: Map<string, { success: number; failure: number; latency: number[] }> =
    new Map();

  private constructor(config: ProviderConfig) {
    this.config = config;
  }

  public static getInstance(): InsightEngine {
    if (!InsightEngine.instance) {
      InsightEngine.instance = new InsightEngine({
        openAIKey: process.env.OPENAI_API_KEY || '',
        anthropicKey: process.env.ANTHROPIC_API_KEY || '',
        cacheTTL: 3600,
        maxMetrics: 1000,
        retry: {
          maxAttempts: 2,
          initialDelayMs: 100,
          maxDelayMs: 500,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 2,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });
    }
    return InsightEngine.instance;
  }

  async generateInsight(request: InsightRequest): Promise<HealthInsight> {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.insightCache.get(cacheKey);

    if (cached) {
      this.cacheHits++;
      return cached;
    }

    this.cacheMisses++;
    const startTime = Date.now();

    try {
      const insight = await this.generateInsightInternal(request);
      this.updateProviderStats('primary', true, Date.now() - startTime);
      this.insightCache.set(cacheKey, insight);
      this.insights.push(insight);
      return insight;
    } catch (error) {
      this.updateProviderStats('primary', false, Date.now() - startTime);
      throw error;
    }
  }

  async generateInsightForPersona(request: PersonaInsightRequest): Promise<HealthInsight> {
    const insight = await this.generateInsight(request);
    return {
      ...insight,
      id: `persona-${request.persona.id}-${insight.id}`,
    };
  }

  public getProviderHealth(): Record<string, ProviderHealthMetrics> {
    // Implementation will be added in a separate PR
    return {
      openai: {
        healthScore: 95,
        averageLatency: 250,
        errorRate: 0.02,
        successRate: 0.98,
        totalRequests: 1000,
      },
      anthropic: {
        healthScore: 98,
        averageLatency: 200,
        errorRate: 0.01,
        successRate: 0.99,
        totalRequests: 800,
      },
    };
  }

  public getTelemetrySnapshot(): TelemetryMetrics {
    // Implementation will be added in a separate PR
    return {
      insights: {
        totalGenerated: 1000,
        averageLatency: 300,
        cacheHitRate: 0.8,
      },
      cache: {
        hitRate: 0.8,
      },
    };
  }

  public getErrorStats(): ErrorStats {
    // Implementation will be added in a separate PR
    return {
      timeline: [
        { timestamp: Date.now() - 3600000, count: 5 },
        { timestamp: Date.now(), count: 2 },
      ],
    };
  }

  getProviderComparison(): ProviderComparison {
    const comparison: ProviderComparison = {
      costComparison: {},
      performanceComparison: {},
    };

    this.providerStats.forEach((stats, provider) => {
      const avgLatency =
        stats.latency.length > 0
          ? stats.latency.reduce((a, b) => a + b, 0) / stats.latency.length
          : 0;
      const reliability = stats.success / (stats.success + stats.failure);

      comparison.costComparison[provider] = avgLatency * 0.001; // Cost per ms
      comparison.performanceComparison[provider] = {
        latency: avgLatency,
        reliability,
      };
    });

    return comparison;
  }

  getCacheStats() {
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      size: this.insightCache.size,
    };
  }

  getUsagePatterns(): UsagePatterns {
    const categoryCount = new Map<string, number>();
    const hourCount = new Map<string, number>();

    this.insights.forEach((insight) => {
      // Count categories
      categoryCount.set(insight.category, (categoryCount.get(insight.category) || 0) + 1);

      // Count hours
      const hour = new Date(insight.date).getHours().toString().padStart(2, '0');
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });

    return {
      popularCategories: Array.from(categoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([category]) => category),
      timeDistribution: Object.fromEntries(hourCount),
    };
  }

  private generateCacheKey(request: InsightRequest): string {
    return `${request.category}-${JSON.stringify(request.metrics)}`;
  }

  private async generateInsightInternal(request: InsightRequest): Promise<HealthInsight> {
    // This would normally call the AI provider
    return {
      id: `insight-${Date.now()}`,
      type: 'success',
      category: request.category,
      message: `Generated insight for ${request.category}`,
      date: new Date(),
      relatedMetrics: Object.keys(request.metrics),
    };
  }

  private updateProviderStats(provider: string, success: boolean, latency: number) {
    const stats = this.providerStats.get(provider) || {
      success: 0,
      failure: 0,
      latency: [],
    };

    if (success) {
      stats.success++;
    } else {
      stats.failure++;
    }

    stats.latency.push(latency);
    if (stats.latency.length > 100) {
      stats.latency.shift(); // Keep only last 100 latency measurements
    }

    this.providerStats.set(provider, stats);
  }
}
