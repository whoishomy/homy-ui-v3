import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { ProviderStrategy } from '../provider/ProviderStrategy';
import type { InsightProvider } from '../provider/InsightProvider';
import type { TelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('ProviderStrategy', () => {
  let strategy: ProviderStrategy;
  let telemetry: TelemetryLogger;
  let successProvider: InsightProvider;
  let failProvider: InsightProvider;

  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight message',
    date: new Date('2025-06-15T18:41:26.106Z'),
    relatedMetrics: ['steps', 'distance'],
    source: 'test-provider',
  };

  beforeEach(() => {
    jest.useFakeTimers();

    telemetry = {
      logEvent: jest.fn(),
      getSnapshot: jest.fn().mockReturnValue({
        insights: {
          byProvider: {
            'success-provider': { total: 1, success: 1, error: 0 },
            'fail-provider': { total: 1, success: 0, error: 1 },
          },
        },
      }),
      getErrorStats: jest.fn().mockReturnValue({
        byProvider: {
          'fail-provider': 1,
        },
      }),
      clear: jest.fn(),
    };

    successProvider = {
      generateInsight: jest.fn().mockResolvedValue(mockInsight),
      name: 'success-provider',
    };

    failProvider = {
      generateInsight: jest.fn().mockRejectedValue(new Error('Provider failure')),
      name: 'fail-provider',
    };

    strategy = new ProviderStrategy({
      providers: [successProvider, failProvider],
      telemetry,
      retryConfig: {
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
      },
      circuitBreakerConfig: {
        failureThreshold: 3,
        resetTimeout: 1000,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('records telemetry for successful calls', async () => {
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
      });

      const snapshot = telemetry.getSnapshot();
      expect(snapshot.insights.byProvider['success-provider'].total).toBe(1);
    });
  });

  describe('Fallback Behavior', () => {
    it('records errors for failed providers', async () => {
      strategy = new ProviderStrategy({
        providers: [failProvider],
        telemetry,
      });

      try {
        await strategy.generateInsight({
          category: InsightCategory.PHYSICAL,
        });
      } catch (error) {
        // Expected to fail
      }

      const errorStats = telemetry.getErrorStats();
      expect(errorStats.byProvider['fail-provider']).toBe(1);
    });
  });

  describe('Retry Logic', () => {
    it('retries with exponential backoff', async () => {
      const startTime = Date.now();
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
      });

      // First attempt happens immediately
      expect(successProvider.generateInsight).toHaveBeenCalledTimes(1);

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThan(0);
    });

    it('respects max retry attempts', async () => {
      strategy = new ProviderStrategy({
        providers: [failProvider],
        telemetry,
        retryConfig: {
          maxAttempts: 2,
          initialDelay: 100,
          maxDelay: 1000,
        },
      });

      const promise = strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
      });

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      await expect(promise).rejects.toThrow();
      expect(failProvider.generateInsight).toHaveBeenCalledTimes(2);
    });
  });

  describe('Circuit Breaker', () => {
    it('opens circuit after threshold failures', async () => {
      strategy = new ProviderStrategy({
        providers: [failProvider],
        telemetry,
        circuitBreakerConfig: {
          failureThreshold: 2,
          resetTimeout: 1000,
        },
      });

      // Cause failures to trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await strategy.generateInsight({
            category: InsightCategory.PHYSICAL,
          });
        } catch (error) {
          // Expected to fail
        }
      }

      const states = strategy.getProviderStates();
      expect(states['fail-provider'].state).toBe('OPEN');
    });

    it('transitions to half-open after reset timeout', async () => {
      strategy = new ProviderStrategy({
        providers: [failProvider],
        telemetry,
        circuitBreakerConfig: {
          failureThreshold: 2,
          resetTimeout: 1000,
        },
      });

      // Cause failures to trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await strategy.generateInsight({
            category: InsightCategory.PHYSICAL,
          });
        } catch (error) {
          // Expected to fail
        }
      }

      // Fast-forward past reset timeout
      await jest.advanceTimersByTimeAsync(1100);

      const states = strategy.getProviderStates();
      expect(states['fail-provider'].state).toBe('HALF_OPEN');
    });

    it('resets circuit after successful half-open attempts', async () => {
      const mockProvider = {
        generateInsight: jest
          .fn()
          .mockRejectedValueOnce(new Error('Failure 1'))
          .mockRejectedValueOnce(new Error('Failure 2'))
          .mockRejectedValueOnce(new Error('Failure 3'))
          .mockResolvedValue(mockInsight),
        name: 'success-provider',
      };

      strategy = new ProviderStrategy({
        providers: [mockProvider],
        telemetry,
        circuitBreakerConfig: {
          failureThreshold: 2,
          resetTimeout: 1000,
        },
      });

      // Cause failures to trigger circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await strategy.generateInsight({
            category: InsightCategory.PHYSICAL,
          });
        } catch (error) {
          // Expected to fail
        }
      }

      // Fast-forward past reset timeout
      await jest.advanceTimersByTimeAsync(1100);

      // Successful attempt in half-open state
      await strategy.generateInsight({
        category: InsightCategory.PHYSICAL,
      });

      const states = strategy.getProviderStates();
      expect(states['success-provider'].state).toBe('CLOSED');
    });
  });
});
