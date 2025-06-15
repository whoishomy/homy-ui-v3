import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { FallbackMiddleware, FallbackError } from '@/services/middleware/FallbackMiddleware';
import { MiddlewareContext } from '@/services/middleware/InsightMiddleware';

describe('FallbackMiddleware', () => {
  let middleware: FallbackMiddleware;
  let mockContext: MiddlewareContext;

  beforeEach(() => {
    middleware = new FallbackMiddleware();
    mockContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      provider: 'test-provider',
    };
  });

  it('should pass through if no error occurs', async () => {
    const nextFn = jest.fn().mockResolvedValue('success');
    const result = await middleware.generateInsight({ prompt: 'test' }, {}, mockContext, nextFn);
    expect(result).toBe('success');
    expect(nextFn).toHaveBeenCalledWith({ prompt: 'test' }, {}, mockContext);
  });

  it('should retry on error up to max attempts', async () => {
    const error = new Error('Test error');
    const nextFn = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await middleware.generateInsight({ prompt: 'test' }, {}, mockContext, nextFn);
    expect(result).toBe('success');
    expect(nextFn).toHaveBeenCalledTimes(3);
  });

  it('should throw FallbackError after max retries', async () => {
    const error = new Error('Test error');
    const nextFn = jest.fn().mockRejectedValue(error);

    await expect(
      middleware.generateInsight({ prompt: 'test' }, {}, mockContext, nextFn)
    ).rejects.toThrow(FallbackError);
  });

  it('should use fallback strategies when available', async () => {
    const error = new Error('Test error');
    const nextFn = jest.fn().mockRejectedValue(error);
    const fallbackStrategy = {
      execute: jest.fn().mockResolvedValue('fallback success'),
      shouldTry: jest.fn().mockReturnValue(true),
    };

    middleware.addStrategy(fallbackStrategy);

    const result = await middleware.generateInsight({ prompt: 'test' }, {}, mockContext, nextFn);

    expect(result).toBe('fallback success');
    expect(fallbackStrategy.execute).toHaveBeenCalled();
  });
});
