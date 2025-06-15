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
import { MiddlewareContext as NewMiddlewareContext } from './types';

export interface TimeoutOptions {
  timeout?: number;
  errorMessage?: string;
  shouldAbort?: boolean;
}

const DEFAULT_TIMEOUT_OPTIONS: TimeoutOptions = {
  timeout: 30000, // 30 seconds
  errorMessage: 'Operation timed out',
  shouldAbort: true,
};

export class TimeoutError extends Error {
  constructor(message: string, public duration: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class TimeoutMiddleware extends BaseInsightMiddleware {
  private readonly options: Required<TimeoutOptions>;

  constructor(options: TimeoutOptions = {}) {
    super();
    this.options = {
      timeout: options.timeout ?? 30000,
      errorMessage: options.errorMessage ?? 'Operation timed out',
      shouldAbort: options.shouldAbort ?? true,
    };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTimeout(next);
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTimeout(next);
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    const abortController = new AbortController();
    const { signal } = abortController;

    const timeoutPromise = new Promise<T>((_, reject) => {
      const startTime = Date.now();
      const timeoutId = setTimeout(() => {
        const duration = Date.now() - startTime;
        if (this.options.shouldAbort) {
          abortController.abort();
        }
        reject(new TimeoutError(this.options.errorMessage, duration));
      }, this.options.timeout);

      // Clean up timeout if operation completes
      if (signal) {
        signal.addEventListener('abort', () => clearTimeout(timeoutId));
      }
    });

    try {
      return await Promise.race([operation(), timeoutPromise]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }
      throw error;
    }
  }
}
