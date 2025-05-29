import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimeoutMiddleware, TimeoutError } from '../middleware/TimeoutMiddleware';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';

describe('TimeoutMiddleware', () => {
  let chain: MiddlewareChain;
  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    action: {
      type: 'suggestion',
      message: 'View details'
    }
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

  it('allows fast operations to complete', async () => {
    const middleware = new TimeoutMiddleware({ timeout: 1000 });
    const operation = vi.fn().mockResolvedValue(mockInsight);

    chain.addMiddleware(middleware);
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(100);
    const result = await promise;

    expect(result).toBe(mockInsight);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('times out slow operations', async () => {
    const middleware = new TimeoutMiddleware({ timeout: 1000 });
    const operation = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockInsight), 2000);
    }));

    chain.addMiddleware(middleware);
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).rejects.toThrow(TimeoutError);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('includes duration in timeout error', async () => {
    const middleware = new TimeoutMiddleware({ timeout: 1000 });
    const operation = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockInsight), 2000);
    }));

    chain.addMiddleware(middleware);
    const startTime = Date.now();
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime, attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(1000);
    const error = await promise.catch(e => e);
    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.duration).toBe(1000);
  });

  it('supports custom error messages', async () => {
    const customMessage = 'Custom timeout message';
    const middleware = new TimeoutMiddleware({
      timeout: 1000,
      errorMessage: customMessage,
    });
    const operation = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockInsight), 2000);
    }));

    chain.addMiddleware(middleware);
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).rejects.toThrow(customMessage);
  });

  it('aborts fetch operations when configured', async () => {
    const middleware = new TimeoutMiddleware({
      timeout: 1000,
      shouldAbort: true,
    });
    const mockAbortController = { abort: vi.fn() };
    const mockAbortSignal = {};
    
    vi.spyOn(global, 'AbortController').mockImplementation(() => mockAbortController as any);
    Object.defineProperty(mockAbortController, 'signal', {
      get: () => mockAbortSignal,
    });

    const operation = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockInsight), 2000);
    }));

    chain.addMiddleware(middleware);
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).rejects.toThrow(TimeoutError);
    expect(mockAbortController.abort).toHaveBeenCalled();
  });

  it('does not abort when shouldAbort is false', async () => {
    const middleware = new TimeoutMiddleware({
      timeout: 1000,
      shouldAbort: false,
    });
    const mockAbortController = { abort: vi.fn() };
    
    vi.spyOn(global, 'AbortController').mockImplementation(() => mockAbortController as any);

    const operation = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockInsight), 2000);
    }));

    chain.addMiddleware(middleware);
    const promise = chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).rejects.toThrow(TimeoutError);
    expect(mockAbortController.abort).not.toHaveBeenCalled();
  });

  it('cleans up timers on completion', async () => {
    const middleware = new TimeoutMiddleware({ timeout: 1000 });
    const operation = vi.fn().mockResolvedValue(mockInsight);

    chain.addMiddleware(middleware);
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    await chain.executeGenerateInsight(
      mockParams,
      mockOptions,
      { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
      operation
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
}); 