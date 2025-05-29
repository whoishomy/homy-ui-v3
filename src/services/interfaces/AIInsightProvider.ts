import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightCache } from '../cache/InsightCache';
import type { InsightTelemetry } from '../telemetry/InsightTelemetry';
import type { CacheKey } from '../cache/InsightCache';

export interface InsightGenerationParams {
  category: string;
  metrics: Record<string, number>;
}

export interface InsightGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  language?: string;
  culturalContext?: Record<string, any>;
  sanitizePrompt?: boolean;
}

export interface AIInsightProvider {
  generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;

  generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;

  generateCacheKey(params: InsightGenerationParams | InsightContext): CacheKey;
}

export abstract class BaseInsightProvider implements AIInsightProvider {
  protected readonly cache: InsightCache;
  protected readonly telemetry: InsightTelemetry;
  protected readonly defaultOptions: InsightGenerationOptions = {
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000,
    language: 'en',
  };

  constructor(cache: InsightCache, telemetry: InsightTelemetry) {
    this.cache = cache;
    this.telemetry = telemetry;
  }

  abstract generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;

  abstract generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;

  protected mergeOptions(options?: InsightGenerationOptions): InsightGenerationOptions {
    return {
      ...this.defaultOptions,
      ...options,
    };
  }

  generateCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    return {
      provider: 'default',
      prompt: JSON.stringify(params),
      systemPrompt: 'You are a health insights generator.',
      options: {
        temperature: this.defaultOptions.temperature ?? 0.7,
      },
    };
  }

  protected async withTelemetry<T>(
    operation: () => Promise<T>,
    metadata: {
      provider: string;
      cacheHit: boolean;
      insightType: string;
    }
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.telemetry.recordMetric({
        timestamp: startTime,
        duration,
        provider: metadata.provider,
        success: true,
        cacheHit: metadata.cacheHit,
        insightType: metadata.insightType,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.telemetry.recordError(error instanceof Error ? error : new Error('Unknown error'), {
        provider: metadata.provider,
        duration,
        insightType: metadata.insightType,
      });

      throw error;
    }
  }
}
