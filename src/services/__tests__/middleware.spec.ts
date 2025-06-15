import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { RetryMiddleware, RetryError } from '../middleware/RetryMiddleware';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import { BaseInsightMiddleware, type MiddlewareContext } from '../middleware/InsightMiddleware';

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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('RetryMiddleware', () => {
    let middleware: RetryMiddleware;
    let mockTelemetryLogger: TelemetryLogger;
    let mockOperation: jest.Mock<Promise<HealthInsight>>;

    const mockContext = {
      operation: 'generateInsight' as InsightOperation,
      startTime: Date.now(),
      attempts: 0,
    };

    beforeEach(() => {
      mockTelemetryLogger = {
        logEvent: jest.fn(),
        getSnapshot: jest.fn(),
        clear: jest.fn(),
      };
      mockOperation = jest.fn<Promise<HealthInsight>>();
      middleware = new RetryMiddleware({
        telemetryLogger: mockTelemetryLogger,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('succeeds on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue(mockInsight);

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
      const error = new Error('Temporary failure');
      mockOperation
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockInsight);

      const promise = middleware.execute(mockOperation, mockContext);

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      const result = await promise;
      expect(result).toBe(mockInsight);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('fails after max attempts', async () => {
      const error = new Error('Persistent failure');
      mockOperation.mockRejectedValue(error);

      const promise = middleware.execute(mockOperation, mockContext);

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      await expect(promise).rejects.toThrow(RetryError);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('uses exponential backoff', async () => {
      const error = new Error('Temporary failure');
      mockOperation
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockInsight);

      const promise = middleware.execute(mockOperation, mockContext);

      // First attempt happens immediately
      expect(mockOperation).toHaveBeenCalledTimes(1);

      // Second attempt after 100ms
      await jest.advanceTimersByTimeAsync(100);
      expect(mockOperation).toHaveBeenCalledTimes(2);

      // Third attempt after additional 200ms
      await jest.advanceTimersByTimeAsync(200);
      expect(mockOperation).toHaveBeenCalledTimes(3);

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
      const operation = jest.fn().mockResolvedValue(mockInsight);

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
