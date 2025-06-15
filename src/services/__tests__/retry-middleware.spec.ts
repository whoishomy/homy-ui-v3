/// <reference types="vitest" />
import { describe, it, expect, jest, beforeEach, type Mock } from '@jest/globals';
import { RetryMiddleware, RetryError } from '../middleware/RetryMiddleware';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('RetryMiddleware', () => {
  let middleware: RetryMiddleware;
  let mockTelemetryLogger: TelemetryLogger;
  let mockOperation: jest.Mock<Promise<HealthInsight>>;

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
    jest.useFakeTimers();
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
    jest.useRealTimers();
  });

  it('should retry failed operations up to maxRetries times', async () => {
    const error = new Error('Test error');
    mockOperation.mockRejectedValue(error);

    await expect(middleware.handle(mockOperation, mockContext)).rejects.toThrow(RetryError);
    expect(mockOperation).toHaveBeenCalledTimes(3); // Default maxRetries is 2 + initial attempt
    expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith({
      type: 'retry',
      operation: mockContext.operation,
      error: error.message,
      attempt: 3,
    });
  });

  it('should succeed if operation succeeds within retry attempts', async () => {
    mockOperation
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce(mockInsight);

    const result = await middleware.handle(mockOperation, mockContext);
    expect(result).toEqual(mockInsight);
    expect(mockOperation).toHaveBeenCalledTimes(2);
  });

  it('should respect custom retry options', async () => {
    const customMiddleware = new RetryMiddleware({
      telemetryLogger: mockTelemetryLogger,
      maxRetries: 1,
      retryDelay: 1000,
    });

    mockOperation.mockRejectedValue(new Error('Test error'));

    const promise = customMiddleware.handle(mockOperation, mockContext);
    jest.advanceTimersByTime(1000);
    await expect(promise).rejects.toThrow(RetryError);

    expect(mockOperation).toHaveBeenCalledTimes(2); // Initial + 1 retry
  });

  it('should handle non-Error rejections', async () => {
    mockOperation.mockRejectedValue('String error');

    await expect(middleware.handle(mockOperation, mockContext)).rejects.toThrow(RetryError);
    expect(mockOperation).toHaveBeenCalledTimes(3);
  });

  it('should pass through operation parameters', async () => {
    mockOperation.mockResolvedValue(mockInsight);

    await middleware.handle(mockOperation, mockContext);
    expect(mockOperation).toHaveBeenCalledWith(mockContext);
  });

  it('should log telemetry events correctly', async () => {
    const error = new Error('Test error');
    mockOperation.mockRejectedValue(error);

    await expect(middleware.handle(mockOperation, mockContext)).rejects.toThrow(RetryError);

    expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'retry',
        operation: mockContext.operation,
        error: error.message,
      })
    );
  });
});
