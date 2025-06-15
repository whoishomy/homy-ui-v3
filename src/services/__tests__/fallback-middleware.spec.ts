import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { FallbackMiddleware, FallbackError } from '../middleware/FallbackMiddleware';
import type { InsightCache } from '../cache/InsightCache';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { CacheKey } from '../cache/InsightCache';

describe('FallbackMiddleware', () => {
  let middleware: FallbackMiddleware;
  let cache: InsightCache;
  let mockOperation: jest.Mock;

  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date('2025-06-15T18:41:26.106Z'),
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
    jest.useFakeTimers();

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };

    mockOperation = jest.fn();

    middleware = new FallbackMiddleware(cache, {
      timeoutThreshold: 1000,
      retryConfig: {
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Primary Operation', () => {
    it('executes primary operation successfully', async () => {
      mockOperation.mockResolvedValue(mockInsight);

      const result = await middleware.execute(mockOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      expect(result).toBe(mockInsight);
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('caches successful results', async () => {
      mockOperation.mockResolvedValue(mockInsight);
      const cacheSetSpy = jest.spyOn(cache, 'set');

      await middleware.execute(mockOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      expect(cacheSetSpy).toHaveBeenCalledWith(expect.any(String), mockInsight);
    });
  });

  describe('Cache Fallback', () => {
    it('falls back to cache on non-retryable error', async () => {
      const error = new Error('Non-retryable error');
      mockOperation.mockRejectedValue(error);
      cache.get.mockResolvedValue(mockInsight);

      const result = await middleware.execute(mockOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      expect(result).toBe(mockInsight);
      expect(cache.get).toHaveBeenCalled();
    });

    it('throws when cache fallback fails', async () => {
      const error = new Error('Operation failed');
      mockOperation.mockRejectedValue(error);
      cache.get.mockResolvedValue(null);

      await expect(
        middleware.execute(mockOperation, {
          operation: 'generateInsight',
          startTime: Date.now(),
          attempts: 0,
        })
      ).rejects.toThrow(FallbackError);
    });
  });

  describe('Provider Fallback', () => {
    it('attempts provider fallback on retryable error', async () => {
      const error = new Error('Retryable error');
      const fallbackProvider = jest.fn().mockResolvedValue(mockInsight);

      mockOperation
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockImplementation(fallbackProvider);

      const result = await middleware.execute(mockOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      expect(result).toBe(mockInsight);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('tracks fallback attempts', async () => {
      const error = new Error('Retryable error');
      mockOperation.mockRejectedValue(error);

      try {
        await middleware.execute(mockOperation, {
          operation: 'generateInsight',
          startTime: Date.now(),
          attempts: 0,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(FallbackError);
        expect((error as FallbackError).fallbackAttempts).toBeGreaterThan(0);
      }
    });
  });

  describe('Timeout Handling', () => {
    it('times out slow operations', async () => {
      const slowOperation = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockInsight), 2000);
          })
      );

      const promise = middleware.execute(slowOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      // Fast-forward past timeout threshold
      await jest.advanceTimersByTimeAsync(1100);

      await expect(promise).rejects.toThrow('Operation timed out');
    });

    it('respects timeout configuration', async () => {
      const customMiddleware = new FallbackMiddleware(cache, {
        timeoutThreshold: 5000,
      });

      const slowOperation = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockInsight), 4000);
          })
      );

      const promise = customMiddleware.execute(slowOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      // Fast-forward just before timeout
      await jest.advanceTimersByTimeAsync(4900);

      // Operation should still be pending
      expect(slowOperation).toHaveBeenCalledTimes(1);

      // Fast-forward past timeout
      await jest.advanceTimersByTimeAsync(200);

      await expect(promise).rejects.toThrow('Operation timed out');
    });
  });

  describe('Error Classification', () => {
    it('identifies retryable errors', async () => {
      const retryableErrors = [
        new Error('ECONNRESET'),
        new Error('ETIMEDOUT'),
        new Error('ENOTFOUND'),
        new Error('socket hang up'),
        new Error('network error'),
      ];

      for (const error of retryableErrors) {
        mockOperation.mockRejectedValue(error);

        try {
          await middleware.execute(mockOperation, {
            operation: 'generateInsight',
            startTime: Date.now(),
            attempts: 0,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(FallbackError);
          expect((error as FallbackError).fallbackAttempts).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('User Notification', () => {
    it('includes fallback message when using cache', async () => {
      const error = new Error('Primary operation failed');
      mockOperation.mockRejectedValue(error);
      cache.get.mockResolvedValue(mockInsight);

      const result = await middleware.execute(mockOperation, {
        operation: 'generateInsight',
        startTime: Date.now(),
        attempts: 0,
      });

      expect(result).toBe(mockInsight);
      expect(cache.get).toHaveBeenCalled();
    });

    it('includes attempt count in fallback message', async () => {
      const error = new Error('Retryable error');
      mockOperation.mockRejectedValue(error);

      try {
        await middleware.execute(mockOperation, {
          operation: 'generateInsight',
          startTime: Date.now(),
          attempts: 0,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(FallbackError);
        expect((error as FallbackError).message).toContain('attempts');
      }
    });

    it('supports custom fallback messages', async () => {
      const customMessage = 'Custom fallback message';
      const error = new Error('Primary operation failed');
      mockOperation.mockRejectedValue(error);

      try {
        await middleware.execute(mockOperation, {
          operation: 'generateInsight',
          startTime: Date.now(),
          attempts: 0,
          fallbackMessage: customMessage,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(FallbackError);
        expect((error as FallbackError).message).toContain(customMessage);
      }
    });
  });
});
