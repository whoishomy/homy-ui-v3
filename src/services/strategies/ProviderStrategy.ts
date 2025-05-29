import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { AIInsightProvider, InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';
import type { InsightTelemetry } from '../telemetry/InsightTelemetry';

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenMaxAttempts: number;
}

export interface ProviderStrategyConfig {
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
  providers: AIInsightProvider[];
  telemetry?: InsightTelemetry;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  successfulAttempts: number;
}

export class ProviderStrategy {
  private readonly config: ProviderStrategyConfig;
  private readonly circuitStates: Map<string, CircuitBreakerState> = new Map();

  constructor(config: ProviderStrategyConfig) {
    this.config = {
      retry: {
        ...config.retry,
        maxAttempts: config.retry?.maxAttempts ?? 3,
        initialDelayMs: config.retry?.initialDelayMs ?? 1000,
        maxDelayMs: config.retry?.maxDelayMs ?? 10000,
        backoffMultiplier: config.retry?.backoffMultiplier ?? 2,
      },
      circuitBreaker: {
        ...config.circuitBreaker,
        failureThreshold: config.circuitBreaker?.failureThreshold ?? 5,
        resetTimeoutMs: config.circuitBreaker?.resetTimeoutMs ?? 60000,
        halfOpenMaxAttempts: config.circuitBreaker?.halfOpenMaxAttempts ?? 3,
      },
      providers: config.providers,
      telemetry: config.telemetry,
    };

    // Initialize circuit breaker states
    this.config.providers.forEach(provider => {
      this.circuitStates.set(this.getProviderId(provider), {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED',
        successfulAttempts: 0,
      });
    });
  }

  private getProviderId(provider: AIInsightProvider): string {
    return provider.constructor.name;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCircuitState(provider: AIInsightProvider): CircuitBreakerState {
    const state = this.circuitStates.get(this.getProviderId(provider));
    if (!state) {
      throw new Error(`Circuit state not found for provider: ${this.getProviderId(provider)}`);
    }
    return state;
  }

  private async updateCircuitState(
    provider: AIInsightProvider,
    success: boolean,
    error?: Error
  ): Promise<void> {
    const providerId = this.getProviderId(provider);
    const state = this.getCircuitState(provider);
    const now = Date.now();

    if (success) {
      if (state.state === 'HALF_OPEN') {
        state.successfulAttempts++;
        if (state.successfulAttempts >= this.config.circuitBreaker.halfOpenMaxAttempts) {
          state.state = 'CLOSED';
          state.failures = 0;
          state.successfulAttempts = 0;
          
          if (this.config.telemetry) {
            this.config.telemetry.recordMetric({
              timestamp: now,
              duration: 0,
              provider: providerId,
              success: true,
              cacheHit: false,
              insightType: 'circuit_breaker_reset',
            });
          }
        }
      } else {
        state.failures = 0;
      }
    } else {
      state.failures++;
      state.lastFailureTime = now;

      if (state.failures >= this.config.circuitBreaker.failureThreshold) {
        state.state = 'OPEN';
        
        if (this.config.telemetry) {
          this.config.telemetry.recordError(
            error || new Error('Circuit breaker opened'),
            {
              provider: providerId,
              circuitBreakerState: state.state,
              failures: state.failures,
            }
          );
        }
      }
    }

    this.circuitStates.set(providerId, state);
  }

  private canTryProvider(provider: AIInsightProvider): boolean {
    const state = this.getCircuitState(provider);
    const now = Date.now();

    switch (state.state) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        if (now - state.lastFailureTime >= this.config.circuitBreaker.resetTimeoutMs) {
          state.state = 'HALF_OPEN';
          state.successfulAttempts = 0;
          return true;
        }
        return false;
      case 'HALF_OPEN':
        return state.successfulAttempts < this.config.circuitBreaker.halfOpenMaxAttempts;
      default:
        return false;
    }
  }

  private calculateBackoff(attempt: number): number {
    const delay = Math.min(
      this.config.retry.initialDelayMs * Math.pow(this.config.retry.backoffMultiplier, attempt),
      this.config.retry.maxDelayMs
    );
    return delay;
  }

  async generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retry.maxAttempts; attempt++) {
      for (const provider of this.config.providers) {
        if (!this.canTryProvider(provider)) {
          continue;
        }

        try {
          const result = await provider.generateInsight(params, options);
          await this.updateCircuitState(provider, true);
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          await this.updateCircuitState(provider, false, lastError);
          
          if (this.config.telemetry) {
            this.config.telemetry.recordError(lastError, {
              provider: this.getProviderId(provider),
              attempt,
              params,
            });
          }
        }
      }

      // If we get here, all providers failed
      if (attempt < this.config.retry.maxAttempts - 1) {
        await this.delay(this.calculateBackoff(attempt));
      }
    }

    throw new Error('All providers failed to generate insight after retries');
  }

  async generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retry.maxAttempts; attempt++) {
      for (const provider of this.config.providers) {
        if (!this.canTryProvider(provider)) {
          continue;
        }

        try {
          const result = await provider.generateInsightForPersona(context, options);
          await this.updateCircuitState(provider, true);
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          await this.updateCircuitState(provider, false, lastError);
          
          if (this.config.telemetry) {
            this.config.telemetry.recordError(lastError, {
              provider: this.getProviderId(provider),
              attempt,
              personaId: context.persona.id,
            });
          }
        }
      }

      // If we get here, all providers failed
      if (attempt < this.config.retry.maxAttempts - 1) {
        await this.delay(this.calculateBackoff(attempt));
      }
    }

    throw new Error('All providers failed to generate persona insight after retries');
  }

  getProviderStates(): Record<string, {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    lastFailureTime: number;
  }> {
    const states: Record<string, any> = {};
    this.circuitStates.forEach((state, providerId) => {
      states[providerId] = {
        state: state.state,
        failures: state.failures,
        lastFailureTime: state.lastFailureTime,
      };
    });
    return states;
  }
} 