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
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';

export interface RetryStrategy {
  maxAttempts: number;
  backoffType: 'exponential' | 'linear' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  jitter?: boolean;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export interface RetryOptions {
  strategy?: Partial<RetryStrategy>;
  telemetryLogger?: TelemetryLogger;
  errorTypes?: {
    retryable: RegExp[];
    nonRetryable: RegExp[];
  };
  providerFallback?: {
    enabled: boolean;
    providers: string[];
    errorMapping: Record<string, string[]>;
  };
}

const DEFAULT_ERROR_PATTERNS = {
  retryable: [
    /rate.?limit/i,
    /timeout|timed?.?out/i,
    /network|connection|unreachable/i,
    /server.?(error|unavailable)/i,
    /service.?unavailable/i,
    /too.?many.?requests/i,
    /5\d{2}/i, // 5XX server errors
  ],
  nonRetryable: [
    /invalid.?(request|input|parameter)/i,
    /unauthorized|forbidden|authentication/i,
    /not.?found/i,
    /4\d{2}/i, // 4XX client errors
    /validation.?error/i,
  ],
};

const DEFAULT_RETRY_STRATEGY: RetryStrategy = {
  maxAttempts: 3,
  backoffType: 'exponential',
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  jitter: true,
};

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error,
    public readonly attempts: number,
    public readonly lastDelay: number
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export class RetryMiddleware extends BaseInsightMiddleware {
  private readonly strategy: RetryStrategy;
  private readonly telemetryLogger?: TelemetryLogger;
  private readonly errorPatterns: typeof DEFAULT_ERROR_PATTERNS;
  private readonly providerFallback?: NonNullable<RetryOptions['providerFallback']>;

  constructor(options: RetryOptions = {}) {
    super();
    this.strategy = { ...DEFAULT_RETRY_STRATEGY, ...options.strategy };
    this.telemetryLogger = options.telemetryLogger;
    this.errorPatterns = {
      retryable: [...DEFAULT_ERROR_PATTERNS.retryable, ...(options.errorTypes?.retryable || [])],
      nonRetryable: [
        ...DEFAULT_ERROR_PATTERNS.nonRetryable,
        ...(options.errorTypes?.nonRetryable || []),
      ],
    };
    this.providerFallback = options.providerFallback;
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithRetry(() => next(), context, {
      operation: 'generateInsight',
      params,
      options,
    });
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithRetry(() => next(), middlewareContext, {
      operation: 'generateInsightForPersona',
      context,
      options,
    });
  }

  private async executeWithRetry(
    operation: () => Promise<HealthInsight>,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): Promise<HealthInsight> {
    let lastError: Error | null = null;
    let lastDelay = 0;

    for (let attempt = 1; attempt <= this.strategy.maxAttempts; attempt++) {
      try {
        const result = await operation();

        if (attempt > 1) {
          this.logRetrySuccess(attempt, context, metadata);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (!this.shouldRetry(lastError, attempt)) {
          this.logRetryFailure(attempt, lastError, context, metadata);
          throw lastError;
        }

        if (attempt < this.strategy.maxAttempts) {
          lastDelay = this.calculateDelay(attempt);

          this.logRetryAttempt(attempt, lastError, lastDelay, context, metadata);

          if (this.providerFallback?.enabled) {
            this.switchProvider(lastError, context);
          }

          await this.delay(lastDelay);
        }
      }
    }

    // If we've exhausted all retries
    throw new RetryError(
      `Failed after ${this.strategy.maxAttempts} attempts`,
      lastError!,
      this.strategy.maxAttempts,
      lastDelay
    );
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    // Check custom retry predicate first
    if (this.strategy.shouldRetry) {
      return this.strategy.shouldRetry(error, attempt);
    }

    const errorMessage = error.message.toLowerCase();

    // Check non-retryable patterns first
    if (this.errorPatterns.nonRetryable.some((pattern) => pattern.test(errorMessage))) {
      return false;
    }

    // Then check retryable patterns
    return this.errorPatterns.retryable.some((pattern) => pattern.test(errorMessage));
  }

  private calculateDelay(attempt: number): number {
    let delay: number;

    switch (this.strategy.backoffType) {
      case 'exponential':
        delay = this.strategy.initialDelay * Math.pow(2, attempt - 1);
        break;
      case 'linear':
        delay = this.strategy.initialDelay * attempt;
        break;
      case 'fixed':
      default:
        delay = this.strategy.initialDelay;
    }

    // Apply max delay limit
    delay = Math.min(delay, this.strategy.maxDelay);

    // Add jitter if enabled
    if (this.strategy.jitter) {
      const jitterFactor = 0.5 + Math.random();
      delay = Math.floor(delay * jitterFactor);
    }

    return delay;
  }

  private switchProvider(error: Error, context: MiddlewareContext): void {
    if (!this.providerFallback?.errorMapping) return;

    const errorMessage = error.message.toLowerCase();
    const currentProvider = (context as any).provider || 'default';

    // Find matching error type and get recommended providers
    for (const [errorType, providers] of Object.entries(this.providerFallback.errorMapping)) {
      if (errorMessage.includes(errorType.toLowerCase())) {
        const availableProviders = providers.filter((p) => p !== currentProvider);
        if (availableProviders.length > 0) {
          // Select next provider (round-robin)
          const nextProvider = availableProviders[0];
          (context as any).provider = nextProvider;
          break;
        }
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private logRetryAttempt(
    attempt: number,
    error: Error,
    delay: number,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'retry_attempt',
      status: 'error',
      provider: (context as any).provider || 'unknown',
      timestamp: Date.now(),
      metadata: {
        attemptNumber: attempt,
        nextDelay: delay,
        operation: metadata.operation,
      },
      error: {
        message: error.message,
        type: error.name,
      },
    });
  }

  private logRetrySuccess(
    attempts: number,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'retry_success',
      status: 'success',
      provider: (context as any).provider || 'unknown',
      timestamp: Date.now(),
      duration: Date.now() - context.startTime,
      metadata: {
        totalAttempts: attempts,
        operation: metadata.operation,
      },
    });
  }

  private logRetryFailure(
    attempts: number,
    error: Error,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'retry_failure',
      status: 'error',
      provider: (context as any).provider || 'unknown',
      timestamp: Date.now(),
      duration: Date.now() - context.startTime,
      error: {
        message: error.message,
        type: error.name,
      },
      metadata: {
        totalAttempts: attempts,
        operation: metadata.operation,
      },
    });
  }
}
