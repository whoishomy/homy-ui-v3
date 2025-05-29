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
import type { TelemetryLogger, TelemetryEvent } from '../telemetry/InsightTelemetryLogger';
import { InMemoryTelemetryLogger } from '../telemetry/InsightTelemetryLogger';

export interface TelemetryOptions {
  logger?: TelemetryLogger;
  includeMetadata?: boolean;
  errorTypes?: Record<string, RegExp>;
}

const DEFAULT_ERROR_TYPES: Record<string, RegExp> = {
  timeout: /timeout|timed? out/i,
  rate_limit: /rate.?limit|too many requests/i,
  validation: /validation|invalid|malformed/i,
  network: /network|connection|unreachable|dns/i,
  auth: /auth|unauthorized|forbidden|invalid.?key/i,
};

export class TelemetryMiddleware extends BaseInsightMiddleware {
  private readonly logger: TelemetryLogger;
  private readonly options: Required<TelemetryOptions>;

  constructor(options: TelemetryOptions = {}) {
    super();
    this.logger = options.logger ?? new InMemoryTelemetryLogger();
    this.options = {
      logger: this.logger,
      includeMetadata: options.includeMetadata ?? false,
      errorTypes: { ...DEFAULT_ERROR_TYPES, ...options.errorTypes },
    };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTelemetry(next, context, {
      operation: 'generateInsight',
      metadata: this.options.includeMetadata
        ? {
            params,
            options,
            insightType: params.category,
          }
        : { insightType: params.category },
    });
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithTelemetry(next, middlewareContext, {
      operation: 'generateInsightForPersona',
      metadata: this.options.includeMetadata
        ? {
            personaId: context.persona.id,
            options,
            insightType: 'persona',
          }
        : { insightType: 'persona' },
    });
  }

  private async executeWithTelemetry(
    operation: NextFunction<HealthInsight>,
    context: MiddlewareContext,
    eventData: Partial<TelemetryEvent>
  ): Promise<HealthInsight> {
    const startTime = Date.now();
    let result: HealthInsight;

    try {
      result = await operation();

      this.logger.logEvent({
        timestamp: startTime,
        duration: Date.now() - startTime,
        provider: result.source,
        status: 'success',
        ...eventData,
      } as TelemetryEvent);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorInfo = this.categorizeError(error);

      this.logger.logEvent({
        timestamp: startTime,
        duration,
        provider: 'unknown', // Provider info might not be available in error case
        status: 'error',
        errorType: errorInfo.type,
        errorMessage: errorInfo.message,
        ...eventData,
      } as TelemetryEvent);

      throw error;
    }
  }

  private categorizeError(error: unknown): { type: string; message: string } {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Find matching error type based on message
    const errorType =
      Object.entries(this.options.errorTypes).find(([_, pattern]) =>
        pattern.test(errorMessage)
      )?.[0] ?? 'unknown';

    return {
      type: errorType,
      message: errorMessage,
    };
  }

  getLogger(): TelemetryLogger {
    return this.logger;
  }
}
