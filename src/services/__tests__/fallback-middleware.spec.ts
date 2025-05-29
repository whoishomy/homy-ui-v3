import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FallbackMiddleware, FallbackError } from '../middleware/FallbackMiddleware';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { CacheKey } from '../cache/InsightCache';

describe('FallbackMiddleware', () => {
  let chain: MiddlewareChain;
  let cache: InMemoryInsightCache;
  let middleware: FallbackMiddleware;

  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'test-provider',
  };

  const mockParams: InsightGenerationParams = {
    category: InsightCategory.PHYSICAL,
    metrics: {
      steps: 1000,
      distance: 5,
    },
  };

  const mockOptions: InsightGenerationOptions = {
    maxTokens: 100,
    temperature: 0.7,
  };

  const mockCacheKey: CacheKey = {
    provider: 'test-provider',
    prompt: JSON.stringify(mockParams),
    systemPrompt: 'Test system prompt',
    options: {
      temperature: 0.7,
    },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    chain = new MiddlewareChain();
    cache = new InMemoryInsightCache();
    middleware = new FallbackMiddleware(cache);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Primary Operation', () => {
    it('succeeds without fallback', async () => {
      const operation = vi.fn().mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result).toEqual(mockInsight);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('caches successful results', async () => {
      const operation = vi.fn().mockResolvedValue(mockInsight);
      const cacheSetSpy = vi.spyOn(cache, 'set');

      chain.addMiddleware(middleware);
      await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(cacheSetSpy).toHaveBeenCalledWith(expect.any(String), mockInsight);
    });
  });

  describe('Cache Fallback', () => {
    it('falls back to cache on non-retryable error', async () => {
      const cachedInsight = { ...mockInsight, id: 'cached-id' };
      await cache.set(mockCacheKey, cachedInsight);

      const operation = vi.fn().mockRejectedValue(new Error('validation_error'));

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result.id).toBe('cached-id');
      expect(result.message).toContain('Using cached insight');
    });

    it('respects cache age limit', async () => {
      const oldInsight = {
        ...mockInsight,
        id: 'old-cached',
        date: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours old
      };
      await cache.set(mockCacheKey, oldInsight);

      const operation = vi.fn().mockRejectedValue(new Error('validation_error'));

      chain.addMiddleware(middleware);
      await expect(
        chain.executeGenerateInsight(
          mockParams,
          mockOptions,
          { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
          operation
        )
      ).rejects.toThrow(FallbackError);
    });
  });

  describe('Provider Fallback', () => {
    it('attempts provider fallback on retryable error', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('rate_limit exceeded'))
        .mockResolvedValueOnce({ ...mockInsight, source: 'fallback-provider' });

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result.source).toBe('fallback-provider');
      expect(result.message).toContain('Using fallback provider');
    });

    it('tracks fallback attempts', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('rate_limit'))
        .mockRejectedValueOnce(new Error('network error'))
        .mockRejectedValue(new Error('server unavailable'));

      chain.addMiddleware(middleware);
      try {
        await chain.executeGenerateInsight(
          mockParams,
          mockOptions,
          { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
          operation
        );
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(FallbackError);
        expect((error as FallbackError).fallbackAttempts).toBeGreaterThan(0);
      }
    });
  });

  describe('Timeout Handling', () => {
    it('times out slow operations', async () => {
      const operation = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(mockInsight), 15000))
        );

      chain.addMiddleware(middleware);
      const promise = chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      await vi.advanceTimersByTimeAsync(11000);
      await expect(promise).rejects.toThrow('Operation timed out');
    });

    it('respects timeout configuration', async () => {
      const customMiddleware = new FallbackMiddleware(cache, {
        timeoutThreshold: 5000,
      });

      const operation = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(mockInsight), 6000))
        );

      chain.addMiddleware(customMiddleware);
      const promise = chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      await vi.advanceTimersByTimeAsync(5100);
      await expect(promise).rejects.toThrow('Operation timed out after 5000ms');
    });
  });

  describe('Error Classification', () => {
    it('identifies retryable errors', async () => {
      const retryableErrors = [
        'rate limit exceeded',
        'network timeout',
        'server unavailable',
        'connection refused',
      ];

      for (const errorMessage of retryableErrors) {
        const operation = vi.fn().mockRejectedValue(new Error(errorMessage));

        chain.addMiddleware(middleware);
        try {
          await chain.executeGenerateInsight(
            mockParams,
            mockOptions,
            { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
            operation
          );
        } catch (error) {
          expect(error).toBeInstanceOf(FallbackError);
          expect((error as FallbackError).fallbackAttempts).toBeGreaterThan(0);
        }
      }
    });

    it('identifies non-retryable errors', async () => {
      const nonRetryableErrors = [
        'validation failed',
        'invalid input',
        'unauthorized',
        'forbidden',
      ];

      for (const errorMessage of nonRetryableErrors) {
        const operation = vi.fn().mockRejectedValue(new Error(errorMessage));

        chain.addMiddleware(middleware);
        try {
          await chain.executeGenerateInsight(
            mockParams,
            mockOptions,
            { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
            operation
          );
        } catch (error) {
          expect(error).toBeInstanceOf(FallbackError);
          expect((error as FallbackError).fallbackAttempts).toBe(0);
        }
      }
    });
  });

  describe('User Notification', () => {
    it('includes fallback message when using cache', async () => {
      const cachedInsight = { ...mockInsight, id: 'cached-id' };
      await cache.set(mockCacheKey, cachedInsight);

      const operation = vi.fn().mockRejectedValue(new Error('validation_error'));

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result.message).toContain('Using cached insight');
    });

    it('includes attempt count in fallback message', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('rate_limit'))
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue({ ...mockInsight, source: 'final-provider' });

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result.message).toContain('2 attempts');
    });

    it('supports custom fallback messages', async () => {
      const customMessage = 'Using alternative data source';
      const customMiddleware = new FallbackMiddleware(cache, {
        customFallbackMessage: customMessage,
      });

      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('rate_limit'))
        .mockResolvedValue({ ...mockInsight, source: 'fallback-provider' });

      chain.addMiddleware(customMiddleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result.message).toContain(customMessage);
    });
  });
});
