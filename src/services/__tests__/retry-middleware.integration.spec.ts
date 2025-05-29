/// <reference types="vitest" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RetryMiddleware } from '../middleware/RetryMiddleware';
import { FallbackMiddleware } from '../middleware/FallbackMiddleware';
import { TelemetryMiddleware } from '../middleware/TelemetryMiddleware';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import { InMemoryTelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type { TelemetryEvent } from '../telemetry/InsightTelemetryLogger';

describe('RetryMiddleware Integration', () => {
  let chain: MiddlewareChain;
  let retryMiddleware: RetryMiddleware;
  let fallbackMiddleware: FallbackMiddleware;
  let telemetryMiddleware: TelemetryMiddleware;
  let telemetryLogger: InMemoryTelemetryLogger;
  let insightCache: InMemoryInsightCache;

  const mockInsight: HealthInsight = {
    id: 'test-insight-1',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'test-provider',
  };

  const mockContext = {
    operation: 'generateInsight' as InsightOperation,
    startTime: Date.now(),
    attempts: 0,
  };

  beforeEach(() => {
    telemetryLogger = new InMemoryTelemetryLogger();
    insightCache = new InMemoryInsightCache();

    retryMiddleware = new RetryMiddleware({
      telemetryLogger,
      strategy: {
        maxAttempts: 3,
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

    telemetryMiddleware = new TelemetryMiddleware({
      logger: telemetryLogger,
      includeMetadata: true,
    });

    chain = new MiddlewareChain();
    chain.addMiddleware(telemetryMiddleware);
    chain.addMiddleware(retryMiddleware);
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

      const snapshot = telemetryLogger.getSnapshot();
      expect(snapshot.events).toHaveLength(1);
      expect(snapshot.events[0]).toMatchObject({
        status: 'success',
        provider: 'test-provider',
      });
    });

    it('coordinates retry and fallback on rate limit error', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts <= 2) {
          throw new Error('rate limit exceeded');
        }
        return {
          ...mockInsight,
          source: 'anthropic',
        };
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('anthropic');

      const snapshot = telemetryLogger.getSnapshot();
      const retryEvents = snapshot.events.filter((e) => e.type?.startsWith('retry_'));

      expect(retryEvents).toHaveLength(3); // attempt, attempt, success
      expect(retryEvents[2]).toMatchObject({
        type: 'retry_success',
        attempts: 3,
      });
    });

    it('handles cascading provider fallbacks', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        switch (attempts) {
          case 1:
            throw new Error('rate limit exceeded'); // Should trigger anthropic
          case 2:
            throw new Error('service unavailable'); // Should trigger local
          default:
            return {
              ...mockInsight,
              source: 'local',
            };
        }
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('local');

      const snapshot = telemetryLogger.getSnapshot();
      const providerSequence = snapshot.events
        .filter((e: TelemetryEvent) => e.provider)
        .map((e: TelemetryEvent) => e.provider);

      expect(providerSequence).toEqual(['anthropic', 'local']);
    });

    it('preserves telemetry across middleware chain', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts === 1) {
          throw new Error('rate limit exceeded');
        }
        return mockInsight;
      };

      await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      const snapshot = telemetryLogger.getSnapshot();

      // Verify operation events
      expect(snapshot.events).toContainEqual(
        expect.objectContaining({
          operation: 'generateInsight',
          status: 'success',
        })
      );

      // Verify retry events
      expect(snapshot.events).toContainEqual(
        expect.objectContaining({
          type: 'retry_attempt',
          error: expect.objectContaining({
            message: expect.stringContaining('rate limit'),
          }),
        })
      );

      // Verify metrics
      expect(snapshot.metrics).toMatchObject({
        totalOperations: expect.any(Number),
        successRate: expect.any(Number),
        errorsByType: expect.any(Object),
      });
    });

    it('respects error categorization across middleware', async () => {
      const validationError = new Error('validation error');
      validationError.name = 'ValidationError';

      const operation = async () => {
        throw validationError;
      };

      await expect(
        chain.executeGenerateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          operation
        )
      ).rejects.toThrow(validationError);

      const snapshot = telemetryLogger.getSnapshot();

      // Should not have retry attempts
      expect(snapshot.events.filter((e) => e.type === 'retry_attempt')).toHaveLength(0);

      // Should record error correctly
      expect(snapshot.events[0]).toMatchObject({
        status: 'error',
        errorType: 'validation',
        errorMessage: expect.stringContaining('validation error'),
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('recovers from transient errors with exponential backoff', async () => {
      const startTime = Date.now();
      let attempts = 0;

      const operation = async () => {
        attempts++;
        if (attempts <= 2) {
          throw new Error('service unavailable');
        }
        return mockInsight;
      };

      await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      const snapshot = telemetryLogger.getSnapshot();
      const retryEvents = snapshot.events.filter((e) => e.type === 'retry_attempt');

      // Verify exponential backoff
      const delays = retryEvents.map((e) => e.metadata?.nextDelay as number);
      expect(delays[1]).toBeGreaterThan(delays[0] * 1.5); // At least 1.5x increase
    });

    it('handles mixed error types with appropriate strategies', async () => {
      let attempts = 0;

      const operation = async () => {
        attempts++;
        switch (attempts) {
          case 1:
            throw new Error('rate limit exceeded'); // Retryable + Provider switch
          case 2:
            throw new Error('network error'); // Retryable
          case 3:
            throw new Error('timeout'); // Provider switch
          default:
            return {
              ...mockInsight,
              source: 'local',
            };
        }
      };

      const result = await chain.executeGenerateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('local');

      const snapshot = telemetryLogger.getSnapshot();
      const errorSequence = snapshot.events
        .filter((e: TelemetryEvent) => e.error?.message)
        .map((e: TelemetryEvent) => e.error!.message);

      expect(errorSequence).toEqual([
        expect.stringContaining('rate limit'),
        expect.stringContaining('network'),
        expect.stringContaining('timeout'),
      ]);
    });
  });
});
