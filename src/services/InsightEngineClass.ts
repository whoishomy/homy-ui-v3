import { InsightProviderFactory, type ProviderConfig } from './providers/InsightProviderFactory';
import { InMemoryInsightCache } from './cache/InMemoryInsightCache';
import { InMemoryTelemetry } from './telemetry/InMemoryTelemetry';
import { RetryMiddleware } from './middleware/RetryMiddleware';
import { TelemetryMiddleware } from './middleware/TelemetryMiddleware';
import { FallbackMiddleware } from './middleware/FallbackMiddleware';
import { MiddlewareChain } from './middleware/MiddlewareChain';
import type { HealthInsight, InsightContext } from '@/types/analytics';
import type {
  AIInsightProvider,
  InsightGenerationParams,
  InsightGenerationOptions,
} from './interfaces/AIInsightProvider';

export class InsightEngine {
  private static instance: InsightEngine;
  private provider: AIInsightProvider;
  private middlewareChain: MiddlewareChain;

  private constructor(config: ProviderConfig) {
    // Initialize provider with factory
    this.provider = InsightProviderFactory.createProvider(config);

    // Initialize middleware chain
    this.middlewareChain = new MiddlewareChain();

    // Add telemetry middleware
    this.middlewareChain.addMiddleware(
      new TelemetryMiddleware({
        includeMetadata: true,
      })
    );

    // Add retry middleware with exponential backoff
    this.middlewareChain.addMiddleware(
      new RetryMiddleware({
        strategy: {
          maxAttempts: 3,
          backoffType: 'exponential',
          initialDelay: 1000,
          maxDelay: 10000,
        },
        providerFallback: {
          enabled: true,
          providers: ['openai', 'anthropic'],
          errorMapping: {
            rate_limit: ['anthropic', 'openai'],
            timeout: ['openai', 'anthropic'],
          },
        },
      })
    );

    // Add fallback middleware with cache support
    this.middlewareChain.addMiddleware(
      new FallbackMiddleware(new InMemoryInsightCache(), {
        enableProviderFallback: true,
        fallbackProviders: ['openai', 'anthropic'],
        maxProviderAttempts: 2,
      })
    );
  }

  public static getInstance(config?: ProviderConfig): InsightEngine {
    if (!InsightEngine.instance) {
      if (!config) {
        throw new Error('Initial configuration required for InsightEngine');
      }
      InsightEngine.instance = new InsightEngine(config);
    }
    return InsightEngine.instance;
  }

  public async generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    return this.middlewareChain.executeGenerateInsight(
      params,
      options ?? {},
      {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      },
      () => this.provider.generateInsight(params, options)
    );
  }

  public async generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    return this.middlewareChain.executeGenerateInsight(
      context,
      options ?? {},
      {
        operation: 'generateInsightForPersona',
        startTime: Date.now(),
        attempts: 0,
      },
      () => this.provider.generateInsightForPersona(context, options)
    );
  }
}
