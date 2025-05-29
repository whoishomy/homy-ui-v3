import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';

export type InsightOperation = 'generateInsight' | 'generateInsightForPersona';

export interface MiddlewareContext {
  operation: InsightOperation;
  startTime: number;
  attempts: number;
  error?: Error;
}

export type NextFunction<T> = () => Promise<T>;

export interface InsightMiddleware {
  generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight>;

  generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight>;
}

export abstract class BaseInsightMiddleware implements InsightMiddleware {
  abstract generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight>;

  abstract generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight>;

  protected createContext(operation: InsightOperation): MiddlewareContext {
    return {
      operation,
      startTime: Date.now(),
      attempts: 0,
    };
  }

  protected updateContext(context: MiddlewareContext, error?: Error): MiddlewareContext {
    return {
      ...context,
      attempts: context.attempts + 1,
      error,
    };
  }
} 