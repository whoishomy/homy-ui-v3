import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';
import { BaseInsightMiddleware, type MiddlewareContext, type NextFunction } from './InsightMiddleware';
import { CircuitBreakerRegistry, type RegistryOptions } from '../circuitBreaker/CircuitBreakerRegistry';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';

export interface CircuitBreakerMiddlewareOptions {
  registry?: CircuitBreakerRegistry;
  registryOptions?: RegistryOptions;
  telemetryLogger?: TelemetryLogger;
  defaultProvider?: string;
  fallbackProviders?: string[];
}

export class CircuitBreakerError extends Error {
  constructor(
    message: string,
    public readonly providerId: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

export class CircuitBreakerMiddleware extends BaseInsightMiddleware {
  private readonly registry: CircuitBreakerRegistry;
  private readonly telemetryLogger?: TelemetryLogger;
  private readonly defaultProvider: string;
  private readonly fallbackProviders: string[];

  constructor(options: CircuitBreakerMiddlewareOptions = {}) {
    super();
    this.registry = options.registry || new CircuitBreakerRegistry(options.registryOptions);
    this.telemetryLogger = options.telemetryLogger;
    this.defaultProvider = options.defaultProvider || 'openai';
    this.fallbackProviders = options.fallbackProviders || ['anthropic', 'local'];

    // Set up registry event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.registry.on('stateChange', (event) => {
      this.logStateChange(event);
    });

    this.registry.on('failure', (event) => {
      this.logFailure(event);
    });
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithCircuitBreaker(
      () => next(),
      context,
      { operation: 'generateInsight', params, options }
    );
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    return this.executeWithCircuitBreaker(
      () => next(),
      middlewareContext,
      { operation: 'generateInsightForPersona', context, options }
    );
  }

  private async executeWithCircuitBreaker(
    operation: () => Promise<HealthInsight>,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): Promise<HealthInsight> {
    const currentProvider = this.getCurrentProvider(context);
    const availableProviders = this.getAvailableProviders(currentProvider);

    for (const providerId of availableProviders) {
      try {
        // Update context with current provider
        (context as any).provider = providerId;

        return await this.registry.executeOperation(providerId, operation);
      } catch (error) {
        const isLastProvider = providerId === availableProviders[availableProviders.length - 1];
        
        if (isLastProvider) {
          throw new CircuitBreakerError(
            `All providers failed for operation: ${metadata.operation}`,
            providerId,
            error as Error
          );
        }
        
        // Log failure and continue with next provider
        this.logProviderFailure(providerId, error as Error, context, metadata);
      }
    }

    // This should never happen as we either return or throw above
    throw new Error('Unexpected error in circuit breaker execution');
  }

  private getCurrentProvider(context: MiddlewareContext): string {
    return (context as any).provider || this.defaultProvider;
  }

  private getAvailableProviders(currentProvider: string): string[] {
    const providers = [currentProvider, ...this.fallbackProviders];
    return providers.filter(providerId => this.registry.isProviderAvailable(providerId));
  }

  private logStateChange(event: any): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'circuit_breaker_state_change',
      timestamp: Date.now(),
      provider: event.providerId,
      status: event.to,
      duration: 0,
      metadata: {
        previousState: event.from,
        metrics: event.metrics,
      },
    });
  }

  private logFailure(event: any): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'circuit_breaker_failure',
      timestamp: Date.now(),
      provider: event.providerId,
      status: 'error',
      duration: 0,
      metadata: {
        metrics: event.metrics,
      },
    });
  }

  private logProviderFailure(
    providerId: string,
    error: Error,
    context: MiddlewareContext,
    metadata: Record<string, any>
  ): void {
    if (!this.telemetryLogger) return;

    this.telemetryLogger.logEvent({
      type: 'provider_failure',
      timestamp: Date.now(),
      provider: providerId,
      status: 'error',
      duration: Date.now() - context.startTime,
      operation: metadata.operation,
      error: {
        message: error.message,
        type: error.name,
      },
      metadata,
    });
  }

  public getRegistry(): CircuitBreakerRegistry {
    return this.registry;
  }
} 