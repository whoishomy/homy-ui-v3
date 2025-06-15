import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { TimeoutMiddleware, TimeoutError } from '@/services/middleware/TimeoutMiddleware';
import type { MiddlewareContext } from '@/services/middleware/types';
import type { HealthInsight } from '@/types/analytics';

describe('TimeoutMiddleware', () => {
  let middleware: TimeoutMiddleware;
  let mockOperation: jest.Mock;
  let context: MiddlewareContext;

  beforeEach(() => {
    jest.useFakeTimers();
    middleware = new TimeoutMiddleware({ timeout: 1000 });
    mockOperation = jest.fn();
    context = {
      startTime: Date.now(),
      signal: new AbortController().signal,
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute operation within timeout', async () => {
    mockOperation.mockResolvedValue('success');
    const promise = middleware.handle(mockOperation, context);
    jest.advanceTimersByTime(500);
    await expect(promise).resolves.toBe('success');
  });

  it('should cancel operation when timeout occurs', async () => {
    mockOperation.mockImplementation(() => new Promise(() => {}));
    const promise = middleware.handle(mockOperation, context);
    jest.advanceTimersByTime(1100);
    await expect(promise).rejects.toThrow(TimeoutError);
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should include timeout value in error message', async () => {
    mockOperation.mockImplementation(() => new Promise(() => {}));
    const promise = middleware.handle(mockOperation, context);
    jest.advanceTimersByTime(1100);
    await expect(promise).rejects.toThrow('Operation timed out after 1000ms');
  });
});
