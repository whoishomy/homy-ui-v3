import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';
import { BaseInsightMiddleware, type MiddlewareContext, type NextFunction } from './InsightMiddleware';
import type { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { CacheKey } from '../cache/InsightCache';

export interface FallbackOptions {
  // Cache settings
  enableCacheFallback?: boolean;
  maxCacheAge?: number; // milliseconds
  
  // Provider settings
  enableProviderFallback?: boolean;
  fallbackProviders?: string[];
  maxProviderAttempts?: number;
  
  // Error handling
  retryableErrors?: string[];
  fallbackOnTimeout?: boolean;
  timeoutThreshold?: number;
  
  // Notification
  notifyUserOnFallback?: boolean;
  customFallbackMessage?: string;
}

const DEFAULT_FALLBACK_OPTIONS: Required<FallbackOptions> = {
  enableCacheFallback: true,
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  
  enableProviderFallback: true,
  fallbackProviders: ['openai', 'anthropic', 'local'],
  maxProviderAttempts: 3,
  
  retryableErrors: [
    'rate_limit',
    'timeout',
    'network',
    'server',
    'unavailable',
  ],
  fallbackOnTimeout: true,
  timeoutThreshold: 10000, // 10 seconds
  
  notifyUserOnFallback: true,
  customFallbackMessage: '',  // Empty string as default instead of undefined
};

export class FallbackError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error,
    public readonly fallbackAttempts: number,
    public readonly usedCache: boolean
  ) {
    super(message);
    this.name = 'FallbackError';
  }
}

export class FallbackMiddleware extends BaseInsightMiddleware {
  private readonly options: Required<FallbackOptions>;
  private readonly cache: InMemoryInsightCache;
  private currentProvider: string = 'default';

  constructor(cache: InMemoryInsightCache, options: Partial<FallbackOptions> = {}) {
    super();
    this.options = { ...DEFAULT_FALLBACK_OPTIONS, ...options };
    this.cache = cache;
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithFallback(
      () => next(),
      params,
      options,
      context,
      this.getCacheKey(params)
    );
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithFallback(
      () => next(),
      context,
      options,
      middlewareContext,
      this.getCacheKey(context)
    );
  }

  private async executeWithFallback(
    operation: () => Promise<HealthInsight>,
    params: InsightGenerationParams | InsightContext,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    cacheKey: CacheKey
  ): Promise<HealthInsight> {
    let lastError: Error | null = null;
    let fallbackAttempts = 0;
    let usedCache = false;

    // Try primary operation
    try {
      const result = await this.executeWithTimeout(operation);
      await this.cache.set(cacheKey, result);
      return this.attachFallbackMetadata(result, false, 0);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If it's not a retryable error, try cache immediately
      if (!this.isRetryableError(lastError)) {
        const cachedResult = await this.tryCacheFallback(cacheKey);
        if (cachedResult) {
          return this.attachFallbackMetadata(cachedResult, true, 0);
        }
      }
    }

    // Try provider fallback if enabled
    if (this.options.enableProviderFallback) {
      try {
        const result = await this.tryProviderFallback(context);
        if (result) {
          await this.cache.set(cacheKey, result);
          return this.attachFallbackMetadata(result, false, fallbackAttempts);
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        fallbackAttempts++;
      }
    }

    // Try cache as last resort
    if (this.options.enableCacheFallback) {
      const cachedResult = await this.tryCacheFallback(cacheKey);
      if (cachedResult) {
        usedCache = true;
        return this.attachFallbackMetadata(cachedResult, true, fallbackAttempts);
      }
    }

    // If all fallbacks fail, throw comprehensive error
    throw new FallbackError(
      'All fallback strategies failed',
      lastError!,
      fallbackAttempts,
      usedCache
    );
  }

  private async executeWithTimeout(
    operation: () => Promise<HealthInsight>
  ): Promise<HealthInsight> {
    if (!this.options.fallbackOnTimeout) {
      return operation();
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.options.timeoutThreshold}ms`));
      }, this.options.timeoutThreshold);
    });

    return Promise.race([operation(), timeoutPromise]);
  }

  private async tryProviderFallback(
    context: MiddlewareContext
  ): Promise<HealthInsight | null> {
    const currentIndex = this.options.fallbackProviders.indexOf(this.currentProvider);
    const nextProviders = this.options.fallbackProviders.slice(currentIndex + 1);

    for (const provider of nextProviders) {
      try {
        this.currentProvider = provider;
        // Provider switch logic would go here
        // This would typically involve calling the specific provider's implementation
        return null; // For now, return null as we haven't implemented provider switching
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  private async tryCacheFallback(cacheKey: CacheKey): Promise<HealthInsight | null> {
    if (!this.options.enableCacheFallback) {
      return null;
    }

    const cached = await this.cache.get(cacheKey);
    if (!cached) {
      return null;
    }

    const cacheAge = Date.now() - cached.date.getTime();
    if (cacheAge > this.options.maxCacheAge) {
      return null;
    }

    return cached;
  }

  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return this.options.retryableErrors.some(type => 
      errorMessage.includes(type.toLowerCase())
    );
  }

  private getCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    const isPersonaContext = 'persona' in params;
    return {
      provider: 'fallback',
      prompt: JSON.stringify(params),
      systemPrompt: isPersonaContext ? 
        `Generate personalized insight for ${(params as InsightContext).persona.id}` : 
        `Generate insight for ${(params as InsightGenerationParams).category}`,
      options: {
        temperature: 0.7,
        maxTokens: 500,
        sanitizePrompt: true
      }
    };
  }

  private attachFallbackMetadata(
    insight: HealthInsight,
    usedCache: boolean,
    attempts: number
  ): HealthInsight {
    if (!this.options.notifyUserOnFallback) {
      return insight;
    }

    const fallbackMessage = this.options.customFallbackMessage ?? 
      (usedCache ? 
        '(Using cached insight due to service disruption)' : 
        attempts > 0 ? 
          `(Using fallback provider after ${attempts} attempt${attempts > 1 ? 's' : ''})` : 
          '');

    return {
      ...insight,
      message: fallbackMessage ? `${insight.message}\n\n${fallbackMessage}` : insight.message,
    };
  }
} 