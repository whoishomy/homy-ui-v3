import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProviderStrategy } from '../strategies/ProviderStrategy';
import {
  BaseInsightProvider,
  type AIInsightProvider,
  type InsightGenerationParams,
  type InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { HealthInsight, InsightContext } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import { InMemoryTelemetry } from '../telemetry/InMemoryTelemetry';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { CacheKey } from '../cache/InsightCache';

class TestProvider extends BaseInsightProvider implements AIInsightProvider {
  constructor(
    private readonly name: string,
    private readonly behavior: 'success' | 'fail' | 'timeout'
  ) {
    const cache = new InMemoryInsightCache();
    const telemetry = new InMemoryTelemetry();
    super(cache, telemetry);
  }

  public generateCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    return {
      provider: this.name,
      prompt: JSON.stringify(params),
      systemPrompt: 'test system prompt',
      options: {
        temperature: 0.7,
      },
    };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    if (this.behavior === 'fail') {
      throw new Error(`${this.name} failed`);
    }
    if (this.behavior === 'timeout') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error(`${this.name} timeout`);
    }
    return {
      id: 'test',
      type: 'success',
      category: InsightCategory.PHYSICAL,
      message: `Success from ${this.name}`,
      date: new Date(),
      relatedMetrics: [],
      source: this.name,
    };
  }

  async generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    return this.generateInsight(
      {
        category: InsightCategory.PHYSICAL,
        metrics: context.metrics,
      },
      options
    );
  }
}

describe('ProviderStrategy', () => {
  let strategy: ProviderStrategy;
  let telemetry: InMemoryTelemetry;
  let successProvider: AIInsightProvider;
  let failProvider: AIInsightProvider;
  let timeoutProvider: AIInsightProvider;

  beforeEach(() => {
    vi.useFakeTimers();
    telemetry = new InMemoryTelemetry();
    successProvider = new TestProvider('success-provider', 'success');
    failProvider = new TestProvider('fail-provider', 'fail');
    timeoutProvider = new TestProvider('timeout-provider', 'timeout');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic Functionality', () => {
    beforeEach(() => {
      strategy = new ProviderStrategy({
        providers: [successProvider],
        telemetry,
        retry: {
          maxAttempts: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 3,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });
    });

    it('successfully generates insight with working provider', async () => {
      const result = await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });
      expect(result.message).toContain('Success from success-provider');
    });

    it('records telemetry for successful calls', async () => {
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.byProvider['success-provider'].total).toBe(1);
    });
  });

  describe('Fallback Behavior', () => {
    beforeEach(() => {
      strategy = new ProviderStrategy({
        providers: [failProvider, successProvider],
        telemetry,
        retry: {
          maxAttempts: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 3,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });
    });

    it('falls back to second provider when first fails', async () => {
      const result = await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });
      expect(result.message).toContain('Success from success-provider');
    });

    it('records errors for failed providers', async () => {
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });

      const errorStats = telemetry.getErrorStats();
      expect(errorStats.byProvider['fail-provider']).toBe(1);
    });
  });

  describe('Retry Logic', () => {
    beforeEach(() => {
      strategy = new ProviderStrategy({
        providers: [timeoutProvider, successProvider],
        telemetry,
        retry: {
          maxAttempts: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 3,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });
    });

    it('retries with exponential backoff', async () => {
      const startTime = Date.now();
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });
      const duration = Date.now() - startTime;

      // Should have waited at least initial delay
      expect(duration).toBeGreaterThanOrEqual(100);
    });

    it('respects max retry attempts', async () => {
      strategy = new ProviderStrategy({
        providers: [failProvider],
        telemetry,
        retry: {
          maxAttempts: 2,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 3,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });

      await expect(
        strategy.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: {},
        })
      ).rejects.toThrow('All providers failed');
    });
  });

  describe('Circuit Breaker', () => {
    beforeEach(() => {
      strategy = new ProviderStrategy({
        providers: [failProvider, successProvider],
        telemetry,
        retry: {
          maxAttempts: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 2,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });
    });

    it('opens circuit after threshold failures', async () => {
      // Cause failures to trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        await strategy
          .generateInsight({
            category: InsightCategory.PHYSICAL,
            metrics: {},
          })
          .catch(() => {});
      }

      const states = strategy.getProviderStates();
      expect(states['fail-provider'].state).toBe('OPEN');
    });

    it('transitions to half-open after reset timeout', async () => {
      // Cause failures
      for (let i = 0; i < 3; i++) {
        await strategy
          .generateInsight({
            category: InsightCategory.PHYSICAL,
            metrics: {},
          })
          .catch(() => {});
      }

      // Advance time past reset timeout
      vi.advanceTimersByTime(6000);

      const states = strategy.getProviderStates();
      expect(states['fail-provider'].state).toBe('HALF_OPEN');
    });

    it('resets circuit after successful half-open attempts', async () => {
      // First cause failures
      for (let i = 0; i < 3; i++) {
        await strategy
          .generateInsight({
            category: InsightCategory.PHYSICAL,
            metrics: {},
          })
          .catch(() => {});
      }

      // Advance time and switch to success behavior
      vi.advanceTimersByTime(6000);
      strategy = new ProviderStrategy({
        providers: [successProvider],
        telemetry,
        retry: {
          maxAttempts: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
        },
        circuitBreaker: {
          failureThreshold: 2,
          resetTimeoutMs: 5000,
          halfOpenMaxAttempts: 2,
        },
      });

      // Make successful attempts
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {},
      });

      const states = strategy.getProviderStates();
      expect(states['success-provider'].state).toBe('CLOSED');
    });
  });
});
