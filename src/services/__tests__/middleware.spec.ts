import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RetryMiddleware } from '../middleware/RetryMiddleware';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import {
  BaseInsightMiddleware,
  type InsightOperation,
  type MiddlewareContext,
} from '../middleware/InsightMiddleware';

describe('Middleware System', () => {
  let chain: MiddlewareChain;
  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'test',
  };

  const mockParams: InsightGenerationParams = {
    category: InsightCategory.PHYSICAL,
    metrics: { steps: 1000 },
  };

  const mockOptions: InsightGenerationOptions = {
    maxTokens: 100,
    temperature: 0.7,
  };

  beforeEach(() => {
    chain = new MiddlewareChain();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('RetryMiddleware', () => {
    it('succeeds on first attempt', async () => {
      const middleware = new RetryMiddleware();
      const operation = vi.fn().mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);
      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result).toBe(mockInsight);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries on retryable error', async () => {
      const middleware = new RetryMiddleware({
        strategy: {
          maxAttempts: 3,
          initialDelay: 100,
          backoffType: 'exponential',
          maxDelay: 1000,
        },
      });
      const error = new Error('rate_limit');
      const operation = vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);

      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result).toBe(mockInsight);
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('fails after max attempts', async () => {
      const middleware = new RetryMiddleware({
        strategy: {
          maxAttempts: 2,
          initialDelay: 100,
          backoffType: 'exponential',
          maxDelay: 1000,
        },
      });
      const error = new Error('rate_limit');
      const operation = vi.fn().mockRejectedValue(error);

      chain.addMiddleware(middleware);

      await expect(
        chain.executeGenerateInsight(
          mockParams,
          mockOptions,
          { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
          operation
        )
      ).rejects.toThrow('Failed after 2 attempts');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('does not retry on non-retryable error', async () => {
      const middleware = new RetryMiddleware({
        errorTypes: {
          retryable: [/rate.?limit/i],
          nonRetryable: [],
        },
      });
      const error = new Error('validation_error');
      const operation = vi.fn().mockRejectedValue(error);

      chain.addMiddleware(middleware);

      await expect(
        chain.executeGenerateInsight(
          mockParams,
          mockOptions,
          { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
          operation
        )
      ).rejects.toThrow('validation_error');

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('uses exponential backoff', async () => {
      const middleware = new RetryMiddleware({
        strategy: {
          maxAttempts: 3,
          initialDelay: 100,
          backoffType: 'exponential',
          maxDelay: 1000,
        },
      });
      const error = new Error('rate_limit');
      const operation = vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);

      const promise = chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      // First attempt fails immediately
      expect(operation).toHaveBeenCalledTimes(1);

      // Second attempt after 100ms
      await vi.advanceTimersByTimeAsync(100);
      expect(operation).toHaveBeenCalledTimes(2);

      // Third attempt after additional 200ms
      await vi.advanceTimersByTimeAsync(200);
      expect(operation).toHaveBeenCalledTimes(3);

      const result = await promise;
      expect(result).toBe(mockInsight);
    });
  });

  describe('MiddlewareChain', () => {
    it('executes middleware in correct order', async () => {
      const order: number[] = [];

      class OrderedMiddleware extends BaseInsightMiddleware {
        constructor(private num: number) {
          super();
        }

        async generateInsight(params: any, options: any, context: any, next: any) {
          order.push(this.num);
          const result = await next();
          order.push(this.num);
          return result;
        }

        async generateInsightForPersona(
          context: any,
          options: any,
          middlewareContext: any,
          next: any
        ) {
          order.push(this.num);
          const result = await next();
          order.push(this.num);
          return result;
        }

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

      chain
        .addMiddleware(new OrderedMiddleware(1))
        .addMiddleware(new OrderedMiddleware(2))
        .addMiddleware(new OrderedMiddleware(3));

      await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        async () => {
          order.push(4);
          return mockInsight;
        }
      );

      expect(order).toEqual([1, 2, 3, 4, 3, 2, 1]);
    });

    it('handles empty middleware chain', async () => {
      const operation = vi.fn().mockResolvedValue(mockInsight);

      const result = await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      expect(result).toBe(mockInsight);
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });
});
