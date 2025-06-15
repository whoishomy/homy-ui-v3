import type { HealthInsight, InsightContext } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import {
  BaseInsightMiddleware,
  type MiddlewareContext,
  type NextFunction,
} from './InsightMiddleware';
import type { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { CacheKey } from '../cache/InsightCache';
import { MiddlewareContext as TypesMiddlewareContext } from './types';

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

  maxAttempts?: number;
  useCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

const DEFAULT_FALLBACK_OPTIONS: Required<FallbackOptions> = {
  enableCacheFallback: true,
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours

  enableProviderFallback: true,
  fallbackProviders: ['openai', 'anthropic', 'local'],
  maxProviderAttempts: 3,

  retryableErrors: ['rate_limit', 'timeout', 'network', 'server', 'unavailable'],
  fallbackOnTimeout: true,
  timeoutThreshold: 10000, // 10 seconds

  notifyUserOnFallback: true,
  customFallbackMessage: '', // Empty string as default instead of undefined

  maxAttempts: 3,
  useCache: true,
  cacheKey: 'fallback',
  cacheTTL: 3600000, // 1 hour
};

export class FallbackError extends Error {
  constructor(
    message: string,
    public originalError: Error,
    public fallbackAttempts: number,
    public usedCache: boolean
  ) {
    super(message);
    this.name = 'FallbackError';
  }
}

interface FallbackStrategy<T> {
  execute: (context: MiddlewareContext) => Promise<T>;
  shouldTry: (error: Error, context: MiddlewareContext) => boolean;
}

export class FallbackMiddleware extends BaseInsightMiddleware {
  private readonly strategies: FallbackStrategy<any>[] = [];
  private readonly options: Required<FallbackOptions>;
  private readonly cache: Map<string, { data: any; timestamp: number }>;
  private currentProvider: string = 'default';

  constructor(options: FallbackOptions = {}) {
    super();
    this.options = {
      maxAttempts: options.maxAttempts ?? 3,
      useCache: options.useCache ?? true,
      cacheKey: options.cacheKey ?? 'fallback',
      cacheTTL: options.cacheTTL ?? 3600000, // 1 hour
      retryableErrors: options.retryableErrors ?? ['timeout', 'network', 'rate limit'],
    };
    this.cache = new Map();
  }

  addStrategy<T>(strategy: FallbackStrategy<T>) {
    this.strategies.push(strategy);
    return this;
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithFallback(next, context);
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithFallback(next, middlewareContext);
  }

  private async executeWithFallback<T>(
    operation: () => Promise<T>,
    context: MiddlewareContext
  ): Promise<T> {
    let lastError: Error | undefined;
    let attempts = 0;

    // Try primary operation first
    try {
      const result = await operation();
      if (this.options.useCache) {
        this.setInCache(this.options.cacheKey, result);
      }
      return result;
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error(String(error));
      }

      // Try from cache if primary operation fails
      if (this.options.useCache) {
        const cached = this.getFromCache<T>(this.options.cacheKey);
        if (cached) {
          return cached;
        }
      }
    }

    // Try fallback strategies
    for (const strategy of this.strategies) {
      if (attempts >= this.options.maxAttempts) {
        break;
      }

      if (!strategy.shouldTry(lastError!, context)) {
        continue;
      }

      try {
        const result = await strategy.execute(context);
        if (this.options.useCache) {
          this.setInCache(this.options.cacheKey, result);
        }
        return result;
      } catch (error) {
        attempts++;
        if (error instanceof Error) {
          lastError = error;
        } else {
          lastError = new Error(String(error));
        }
      }
    }

    throw new FallbackError('All fallback strategies failed', lastError!, attempts, false);
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

  private async tryProviderFallback(context: MiddlewareContext): Promise<HealthInsight | null> {
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

    const cached = await this.getFromCache<HealthInsight>(this.options.cacheKey);
    if (!cached) {
      return null;
    }

    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge > this.options.maxCacheAge) {
      return null;
    }

    return cached;
  }

  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return this.options.retryableErrors.some((type) => errorMessage.includes(type.toLowerCase()));
  }

  private getCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    const isPersonaContext = 'persona' in params;
    return {
      provider: 'fallback',
      prompt: JSON.stringify(params),
      systemPrompt: isPersonaContext
        ? `Generate personalized insight for ${(params as InsightContext).persona.id}`
        : `Generate insight for ${(params as InsightGenerationParams).category}`,
      options: {
        temperature: 0.7,
        maxTokens: 500,
        sanitizePrompt: true,
      },
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

    const fallbackMessage =
      this.options.customFallbackMessage ??
      (usedCache
        ? '(Using cached insight due to service disruption)'
        : attempts > 0
        ? `(Using fallback provider after ${attempts} attempt${attempts > 1 ? 's' : ''})`
        : '');

    return {
      ...insight,
      message: fallbackMessage ? `${insight.message}\n\n${fallbackMessage}` : insight.message,
    };
  }

  private getFromCache<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    if (Date.now() - cached.timestamp > this.options.cacheTTL) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }

  private setInCache(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
