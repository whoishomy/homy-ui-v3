/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { RetryMiddleware, RetryError } from '../middleware/RetryMiddleware';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('RetryMiddleware', () => {
  let middleware: RetryMiddleware;
  let mockTelemetryLogger: TelemetryLogger;
  let mockOperation: Mock<[], Promise<HealthInsight>>;

  const mockInsight: HealthInsight = {
    id: 'test-id',
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
    vi.useFakeTimers();
    mockTelemetryLogger = {
      logEvent: vi.fn(),
      getSnapshot: vi.fn(),
      clear: vi.fn(),
    };
    mockOperation = vi.fn<[], Promise<HealthInsight>>();
    middleware = new RetryMiddleware({
      telemetryLogger: mockTelemetryLogger,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Retry Behavior', () => {
    it('succeeds without retry on successful operation', async () => {
      mockOperation.mockResolvedValueOnce(mockInsight);

      const result = await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(result).toEqual(mockInsight);
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(mockTelemetryLogger.logEvent).not.toHaveBeenCalled();
    });

    it('retries on retryable error', async () => {
      mockOperation
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce(mockInsight);

      const result = await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(result).toEqual(mockInsight);
      expect(mockOperation).toHaveBeenCalledTimes(2);
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_attempt',
          error: expect.objectContaining({
            message: expect.stringContaining('rate limit'),
          }),
        })
      );
    });

    it('does not retry on non-retryable error', async () => {
      const error = new Error('validation error');
      mockOperation.mockRejectedValueOnce(error);

      await expect(
        middleware.generateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          mockOperation
        )
      ).rejects.toThrow(error);

      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_failure',
          error: expect.objectContaining({
            message: expect.stringContaining('validation'),
          }),
        })
      );
    });

    it('respects max attempts limit', async () => {
      const error = new Error('rate limit exceeded');
      mockOperation.mockRejectedValue(error);

      await expect(
        middleware.generateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          mockOperation
        )
      ).rejects.toThrow(RetryError);

      expect(mockOperation).toHaveBeenCalledTimes(3); // Default max attempts
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_failure',
          attempts: 3,
        })
      );
    });
  });

  describe('Backoff Strategy', () => {
    it('implements exponential backoff with jitter', async () => {
      mockOperation
        .mockRejectedValueOnce(new Error('rate limit'))
        .mockRejectedValueOnce(new Error('rate limit'))
        .mockResolvedValueOnce(mockInsight);

      const delays: number[] = [];
      const originalDelay = global.setTimeout;
      (global as any).setTimeout = (fn: Function, delay: number) => {
        delays.push(delay);
        return originalDelay(fn, 0);
      };

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(delays.length).toBe(2);
      expect(delays[1]).toBeGreaterThan(delays[0]); // Exponential increase
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_success',
          attempts: 3,
        })
      );
    });

    it('respects custom backoff strategy', async () => {
      middleware = new RetryMiddleware({
        telemetryLogger: mockTelemetryLogger,
        strategy: {
          backoffType: 'linear',
          initialDelay: 100,
          maxDelay: 500,
        },
      });

      mockOperation
        .mockRejectedValueOnce(new Error('rate limit'))
        .mockRejectedValueOnce(new Error('rate limit'))
        .mockResolvedValueOnce(mockInsight);

      const delays: number[] = [];
      const originalDelay = global.setTimeout;
      (global as any).setTimeout = (fn: Function, delay: number) => {
        delays.push(delay);
        return originalDelay(fn, 0);
      };

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(delays[1] - delays[0]).toBe(100); // Linear increase
    });
  });

  describe('Provider Fallback', () => {
    it('switches provider on specific errors', async () => {
      middleware = new RetryMiddleware({
        telemetryLogger: mockTelemetryLogger,
        providerFallback: {
          enabled: true,
          providers: ['openai', 'anthropic', 'local'],
          errorMapping: {
            rate_limit: ['anthropic', 'local'],
            timeout: ['local', 'openai'],
          },
        },
      });

      mockOperation
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce(mockInsight);

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            provider: 'anthropic',
          }),
        })
      );
    });

    it('maintains provider order in error mapping', async () => {
      middleware = new RetryMiddleware({
        telemetryLogger: mockTelemetryLogger,
        providerFallback: {
          enabled: true,
          providers: ['openai', 'anthropic', 'local'],
          errorMapping: {
            rate_limit: ['anthropic', 'local'],
          },
        },
      });

      mockOperation
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce(mockInsight);

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      const events = (mockTelemetryLogger.logEvent as Mock).mock.calls
        .filter((call: any) => call[0].context?.provider)
        .map((call: any) => call[0].context.provider);

      expect(events).toEqual(['anthropic', 'local']);
    });
  });

  describe('Telemetry Integration', () => {
    it('logs comprehensive retry attempt data', async () => {
      mockOperation
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce(mockInsight);

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_attempt',
          attempt: 1,
          error: expect.any(Object),
          nextDelay: expect.any(Number),
          context: expect.objectContaining({
            operation: 'generateInsight',
          }),
        })
      );
    });

    it('tracks successful retry completion', async () => {
      mockOperation
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce(mockInsight);

      await middleware.generateInsight(
        { category: InsightCategory.PHYSICAL, metrics: {} },
        {},
        mockContext,
        mockOperation
      );

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_success',
          attempts: 2,
          duration: expect.any(Number),
        })
      );
    });

    it('includes detailed error information in telemetry', async () => {
      const error = new Error('rate limit exceeded');
      error.name = 'RateLimitError';
      mockOperation.mockRejectedValue(error);

      await expect(
        middleware.generateInsight(
          { category: InsightCategory.PHYSICAL, metrics: {} },
          {},
          mockContext,
          mockOperation
        )
      ).rejects.toThrow(RetryError);

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry_failure',
          error: {
            message: 'rate limit exceeded',
            type: 'RateLimitError',
          },
        })
      );
    });
  });
});
