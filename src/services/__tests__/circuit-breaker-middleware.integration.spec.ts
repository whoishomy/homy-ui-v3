/// <reference types="vitest" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CircuitBreakerMiddleware } from '../middleware/CircuitBreakerMiddleware';
import { RetryMiddleware } from '../middleware/RetryMiddleware';
import { FallbackMiddleware } from '../middleware/FallbackMiddleware';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import { InMemoryTelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import type { TelemetryEvent } from '../telemetry/InsightTelemetryLogger';
import { InsightCategory } from '@/types/analytics';

describe('CircuitBreaker Integration', () => {
  let chain: MiddlewareChain;
  let circuitBreakerMiddleware: CircuitBreakerMiddleware;
  let retryMiddleware: RetryMiddleware;
  let fallbackMiddleware: FallbackMiddleware;
  let telemetryLogger: InMemoryTelemetryLogger;
  let insightCache: InMemoryInsightCache;

  const mockInsight: HealthInsight = {
    id: 'test-insight-1',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'openai',
  };

  const mockContext = {
    operation: 'generateInsight' as InsightOperation,
    startTime: Date.now(),
    attempts: 0,
  };

  beforeEach(() => {
    telemetryLogger = new InMemoryTelemetryLogger();
    insightCache = new InMemoryInsightCache();

    // Initialize middlewares
    circuitBreakerMiddleware = new CircuitBreakerMiddleware({
      telemetryLogger,
      defaultProvider: 'openai',
      fallbackProviders: ['anthropic', 'local'],
      registryOptions: {
        defaultOptions: {
          failureThreshold: 30,
          minimumRequests: 3,
          resetTimeout: 1000,
        },
      },
    });

    retryMiddleware = new RetryMiddleware({
      telemetryLogger,
      strategy: {
        maxAttempts: 2,
        backoffType: 'exponential',
        initialDelay: 100,
        maxDelay: 1000,
      },
      providerFallback: {
        enabled: true,
        providers: ['openai', 'anthropic', 'local'],
        errorMapping: {
          rate_limit: ['anthropic', 'local'],
          timeout: ['local', 'openai'],
        },
      },
    });

    fallbackMiddleware = new FallbackMiddleware(insightCache, {
      enableProviderFallback: true,
      fallbackProviders: ['openai', 'anthropic', 'local'],
      maxProviderAttempts: 2,
      retryableErrors: ['rate_limit', 'timeout'],
      notifyUserOnFallback: true,
    });

    // Set up middleware chain
    chain = new MiddlewareChain();
    chain.addMiddleware(retryMiddleware);
    chain.addMiddleware(circuitBreakerMiddleware);
    chain.addMiddleware(fallbackMiddleware);
  });

  afterEach(() => {
    insightCache.dispose();
  });

  describe('Middleware Chain Integration', () => {
    it('handles successful operation through entire chain', async () => {
      const operation = async () => mockInsight;

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result).toEqual(mockInsight);

      const events = telemetryLogger.getSnapshot().events;
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        status: 'success',
        provider: 'openai',
      });
    });

    it('follows retry → circuit breaker → fallback flow on failures', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        switch (attempts) {
          case 1:
          case 2:
            throw new Error('rate limit exceeded'); // Should trigger retry
          case 3:
          case 4:
            throw new Error('service unavailable'); // Should trigger circuit breaker
          default:
            return { ...mockInsight, source: 'anthropic' };
        }
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('anthropic');

      const events = telemetryLogger.getSnapshot().events;
      const eventSequence = events.map((e) => e.type).filter(Boolean);

      // Verify event sequence
      expect(eventSequence).toEqual(
        expect.arrayContaining([
          'retry_attempt',
          'retry_failure',
          'circuit_breaker_state_change',
          'provider_failure',
        ])
      );
    });

    it('handles cascading provider failures with circuit breaker state changes', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        switch (attempts) {
          case 1:
          case 2:
            throw new Error('rate limit exceeded'); // OpenAI fails
          case 3:
          case 4:
            throw new Error('service unavailable'); // Anthropic fails
          default:
            return { ...mockInsight, source: 'local' }; // Local succeeds
        }
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('local');

      const events = telemetryLogger.getSnapshot().events;

      // Verify OpenAI circuit breaker opened
      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'circuit_breaker_state_change',
          provider: 'openai',
          status: 'open',
        })
      );

      // Verify Anthropic circuit breaker opened
      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'circuit_breaker_state_change',
          provider: 'anthropic',
          status: 'open',
        })
      );
    });

    it('respects circuit breaker state during retry attempts', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts <= 3) {
          throw new Error('service unavailable');
        }
        return mockInsight;
      };

      // First call - should trigger circuit breaker
      try {
        await chain.executeGenerateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          operation
        );
      } catch (e) {
        // Expected
      }

      // Second call - should immediately fail due to open circuit
      const secondCallStart = Date.now();
      try {
        await chain.executeGenerateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          operation
        );
      } catch (e) {
        // Expected
      }
      const secondCallDuration = Date.now() - secondCallStart;

      // Verify fast failure (circuit breaker prevented retry attempts)
      expect(secondCallDuration).toBeLessThan(100); // No delay from retry
    });

    it('recovers service after circuit breaker timeout', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts <= 3) {
          throw new Error('service unavailable');
        }
        return mockInsight;
      };

      // First call - trigger circuit breaker
      try {
        await chain.executeGenerateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          operation
        );
      } catch (e) {
        // Expected
      }

      // Wait for reset timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Service should recover
      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result).toEqual(mockInsight);

      const events = telemetryLogger.getSnapshot().events;
      const stateChanges = events
        .filter((e) => e.type === 'circuit_breaker_state_change')
        .map((e) => e.status);

      expect(stateChanges).toEqual(['open', 'half-open', 'closed']);
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('handles mixed error types with appropriate middleware responses', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        switch (attempts) {
          case 1:
            throw new Error('rate limit exceeded'); // Should trigger retry
          case 2:
            throw new Error('network error'); // Should trigger retry
          case 3:
            throw new Error('service unavailable'); // Should trigger circuit breaker
          case 4:
            return { ...mockInsight, source: 'anthropic' }; // Success with fallback
          default:
            throw new Error('unexpected attempt');
        }
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('anthropic');

      const events = telemetryLogger.getSnapshot().events;
      const errorSequence = events
        .filter((e: TelemetryEvent) => e.error?.message)
        .map((e: TelemetryEvent) => e.error!.message);

      expect(errorSequence).toEqual([
        expect.stringContaining('rate limit'),
        expect.stringContaining('network'),
        expect.stringContaining('service unavailable'),
      ]);
    });

    it('maintains provider order across middleware chain', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts <= 4) {
          throw new Error('service unavailable');
        }
        return { ...mockInsight, source: 'local' };
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('local');

      const events = telemetryLogger.getSnapshot().events;
      const providerSequence = events
        .filter((e: TelemetryEvent) => e.provider)
        .map((e: TelemetryEvent) => e.provider);

      // Verify provider order maintained
      const uniqueProviders = [...new Set(providerSequence)];
      expect(uniqueProviders).toEqual(['openai', 'anthropic', 'local']);
    });
  });
});
