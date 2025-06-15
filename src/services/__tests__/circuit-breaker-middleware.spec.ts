/// <reference types="vitest" />
import { describe, it, expect, jest, beforeEach, afterEach  } from '@jest/globals';
import { CircuitBreakerMiddleware, CircuitBreakerError } from '../middleware/CircuitBreakerMiddleware';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import type { HealthInsight, InsightOperation } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('CircuitBreakerMiddleware', () => {
  let middleware: CircuitBreakerMiddleware;
  let mockTelemetryLogger: TelemetryLogger;

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
    jest.useFakeTimers();
    mockTelemetryLogger = {
      logEvent: jest.fn(),
      getSnapshot: jest.fn(),
      clear: jest.fn(),
    };

    middleware = new CircuitBreakerMiddleware({
      telemetryLogger: mockTelemetryLogger,
      defaultProvider: 'openai',
      fallbackProviders: ['anthropic', 'local'],
      registryOptions: {
        defaultOptions: {
          failureThreshold: 30,
          minimumRequests: 3,
          resetTimeout: 1000,
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Operation', () => {
    it('successfully executes operation with default provider', async () => {
      const operation = async () => mockInsight;

      const result = await middleware.generateInsight(
        { category: 'PHYSICAL', metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result).toEqual(mockInsight);
      expect(mockTelemetryLogger.logEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circuit_breaker_failure',
        })
      );
    });

    it('fails immediately with non-retryable error', async () => {
      const error = new Error('validation error');
      const operation = async () => { throw error; };

      await expect(middleware.generateInsight(
        { category: 'PHYSICAL', metrics: {} },
        {},
        mockContext,
        operation
      )).rejects.toThrow(CircuitBreakerError);

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_failure',
          error: expect.objectContaining({
            message: expect.stringContaining('validation'),
          }),
        })
      );
    });
  });

  describe('Circuit Breaker State Transitions', () => {
    it('transitions to open state after failure threshold', async () => {
      const error = new Error('service unavailable');
      const operation = async () => { throw error; };

      // Execute enough failures to trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await middleware.generateInsight(
            { category: 'PHYSICAL', metrics: {} },
            {},
            mockContext,
            operation
          );
        } catch (e) {
          // Expected
        }
      }

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circuit_breaker_state_change',
          status: 'open',
        })
      );
    });

    it('attempts reset after timeout', async () => {
      const error = new Error('service unavailable');
      const operation = async () => { throw error; };

      // Trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await middleware.generateInsight(
            { category: 'PHYSICAL', metrics: {} },
            {},
            mockContext,
            operation
          );
        } catch (e) {
          // Expected
        }
      }

      // Advance time past reset timeout
      jest.advanceTimersByTime(1100);

      // Should attempt half-open state
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circuit_breaker_state_change',
          status: 'half-open',
        })
      );
    });
  });

  describe('Provider Fallback', () => {
    it('falls back to next provider on failure', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('service unavailable'))
        .mockResolvedValueOnce({ ...mockInsight, source: 'anthropic' });

      const result = await middleware.generateInsight(
        { category: 'PHYSICAL', metrics: {} },
        {},
        mockContext,
        operation
      );

      expect(result.source).toBe('anthropic');
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_failure',
          provider: 'openai',
        })
      );
    });

    it('tries all available providers before failing', async () => {
      const error = new Error('service unavailable');
      const operation = async () => { throw error; };

      await expect(middleware.generateInsight(
        { category: 'PHYSICAL', metrics: {} },
        {},
        mockContext,
        operation
      )).rejects.toThrow(CircuitBreakerError);

      // Should have tried all providers
      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_failure',
          provider: 'local',
        })
      );
    });
  });

  describe('Telemetry Integration', () => {
    it('logs state changes', async () => {
      const registry = middleware.getRegistry();
      const breaker = registry.getOrCreateBreaker('openai');

      // Simulate state change
      breaker.emit('stateChange', {
        providerId: 'openai',
        from: 'closed',
        to: 'open',
        metrics: breaker.getMetrics(),
      });

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circuit_breaker_state_change',
          provider: 'openai',
          status: 'open',
        })
      );
    });

    it('logs circuit breaker failures', async () => {
      const registry = middleware.getRegistry();
      const breaker = registry.getOrCreateBreaker('openai');

      // Simulate failure
      breaker.emit('failure', {
        providerId: 'openai',
        error: new Error('test error'),
        metrics: breaker.getMetrics(),
      });

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circuit_breaker_failure',
          provider: 'openai',
          error: expect.objectContaining({
            message: 'test error',
          }),
        })
      );
    });

    it('tracks provider failures', async () => {
      const error = new Error('service unavailable');
      const operation = async () => { throw error; };

      try {
        await middleware.generateInsight(
          { category: 'PHYSICAL', metrics: {} },
          {},
          mockContext,
          operation
        );
      } catch (e) {
        // Expected
      }

      expect(mockTelemetryLogger.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_failure',
          provider: 'openai',
          error: expect.objectContaining({
            message: 'service unavailable',
          }),
        })
      );
    });
  });
}); 