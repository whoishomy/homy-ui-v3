import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';
import { BaseInsightMiddleware, type MiddlewareContext, type NextFunction } from './InsightMiddleware';

export interface TimeoutOptions {
  timeout: number;
  errorMessage?: string;
  shouldAbort?: boolean;
}

const DEFAULT_TIMEOUT_OPTIONS: TimeoutOptions = {
  timeout: 30000, // 30 seconds
  errorMessage: 'Operation timed out',
  shouldAbort: true,
};

export class TimeoutError extends Error {
  constructor(message: string, public readonly duration: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class TimeoutMiddleware extends BaseInsightMiddleware {
  private readonly options: TimeoutOptions;

  constructor(options: Partial<TimeoutOptions> = {}) {
    super();
    this.options = { ...DEFAULT_TIMEOUT_OPTIONS, ...options };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTimeout(next, context);
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTimeout(next, middlewareContext);
  }

  private async executeWithTimeout(
    operation: NextFunction<HealthInsight>,
    context: MiddlewareContext
  ): Promise<HealthInsight> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (this.options.shouldAbort) {
        controller.abort();
      }
    }, this.options.timeout);

    try {
      const operationPromise = operation();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          const duration = Date.now() - context.startTime;
          reject(new TimeoutError(this.options.errorMessage!, duration));
        }, this.options.timeout);
      });

      if (this.options.shouldAbort) {
        // Add abort signal to the context for fetch operations
        (context as any).signal = controller.signal;
      }

      return await Promise.race([operationPromise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }
  }
} 