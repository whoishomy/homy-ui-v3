import { describe, it, expect, beforeEach  } from '@jest/globals';
import { ProviderHealthMetrics } from '../telemetry/ProviderHealthMetrics';
import type { TelemetryEvent, TelemetrySnapshot } from '../telemetry/InsightTelemetryLogger';

describe('ProviderHealthMetrics', () => {
  let metrics: ProviderHealthMetrics;
  let mockSnapshot: TelemetrySnapshot;
  const currentTime = Date.now();

  beforeEach(() => {
    metrics = new ProviderHealthMetrics({ timeWindowMs: 3600000 }); // 1 hour window
    mockSnapshot = {
      events: [],
      metrics: {
        totalEvents: 0,
        successCount: 0,
        errorCount: 0,
        avgDuration: 0,
        providerStats: {},
      },
    };
  });

  describe('getProviderHealthScore', () => {
    it('returns perfect score for provider with no events', () => {
      const score = metrics.getProviderHealthScore('openai', mockSnapshot);
      
      expect(score).toEqual({
        score: 100,
        state: 'closed',
        successRate: 1,
        avgResponseTime: 0,
        failureRate: 0,
        circuitBreakerTrips: 0,
        recoveryRate: 1,
      });
    });

    it('calculates correct health score for mixed success/failure events', () => {
      const events: TelemetryEvent[] = [
        {
          type: 'insight_generation',
          status: 'success',
          provider: 'openai',
          timestamp: currentTime - 1000,
          duration: 500,
          operation: 'generateInsight',
        },
        {
          type: 'insight_generation',
          status: 'error',
          provider: 'openai',
          timestamp: currentTime - 2000,
          duration: 1000,
          operation: 'generateInsight',
          error: {
            message: 'Rate limit exceeded',
            type: 'rate_limit',
          },
        },
      ];

      mockSnapshot.events = events;
      const score = metrics.getProviderHealthScore('openai', mockSnapshot);

      expect(score.successRate).toBe(0.5);
      expect(score.failureRate).toBe(0.5);
      expect(score.avgResponseTime).toBe(750);
      expect(score.score).toBeLessThan(100);
    });

    it('factors in circuit breaker trips', () => {
      const events: TelemetryEvent[] = [
        {
          type: 'circuit_breaker_state_change',
          status: 'open',
          provider: 'openai',
          timestamp: currentTime - 1000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'closed',
            reason: 'Error threshold exceeded',
          },
        },
      ];

      mockSnapshot.events = events;
      const score = metrics.getProviderHealthScore('openai', mockSnapshot);

      expect(score.circuitBreakerTrips).toBe(1);
      expect(score.score).toBeLessThan(100);
    });

    it('considers recovery rate in health score', () => {
      const events: TelemetryEvent[] = [
        {
          type: 'circuit_breaker_state_change',
          status: 'half-open',
          provider: 'openai',
          timestamp: currentTime - 2000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'open',
          },
        },
        {
          type: 'circuit_breaker_state_change',
          status: 'closed',
          provider: 'openai',
          timestamp: currentTime - 1000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'half-open',
          },
        },
      ];

      mockSnapshot.events = events;
      const score = metrics.getProviderHealthScore('openai', mockSnapshot);

      expect(score.recoveryRate).toBe(1);
      expect(score.state).toBe('closed');
    });
  });

  describe('getFallbackMetrics', () => {
    it('calculates correct fallback metrics', () => {
      const events: TelemetryEvent[] = [
        {
          type: 'provider_failure',
          status: 'error',
          provider: 'openai',
          timestamp: currentTime - 2000,
          operation: 'generateInsight',
          duration: 150,
          metadata: {
            nextProvider: 'anthropic',
            fallbackSuccess: true,
          },
        },
        {
          type: 'provider_failure',
          status: 'error',
          provider: 'openai',
          timestamp: currentTime - 1000,
          operation: 'generateInsight',
          duration: 200,
          metadata: {
            nextProvider: 'local',
            fallbackSuccess: false,
          },
        },
      ];

      mockSnapshot.events = events;
      const fallbackMetrics = metrics.getFallbackMetrics(mockSnapshot);

      expect(fallbackMetrics.totalFallbacks).toBe(2);
      expect(fallbackMetrics.successfulFallbacks).toBe(1);
      expect(fallbackMetrics.failedFallbacks).toBe(1);
      expect(fallbackMetrics.fallbackSuccessRate).toBe(0.5);
      expect(fallbackMetrics.providerFallbackMap).toEqual({
        openai: ['anthropic', 'local'],
      });
    });
  });

  describe('getStateTransitions', () => {
    it('returns state transitions in chronological order', () => {
      const events: TelemetryEvent[] = [
        {
          type: 'circuit_breaker_state_change',
          status: 'open',
          provider: 'openai',
          timestamp: currentTime - 3000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'closed',
            reason: 'Error threshold exceeded',
          },
        },
        {
          type: 'circuit_breaker_state_change',
          status: 'half-open',
          provider: 'openai',
          timestamp: currentTime - 2000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'open',
            reason: 'Reset timeout elapsed',
          },
        },
        {
          type: 'circuit_breaker_state_change',
          status: 'closed',
          provider: 'openai',
          timestamp: currentTime - 1000,
          operation: 'generateInsight',
          metadata: {
            previousState: 'half-open',
            reason: 'Success threshold met',
          },
        },
      ];

      mockSnapshot.events = events;
      const transitions = metrics.getStateTransitions('openai', mockSnapshot);

      expect(transitions).toHaveLength(3);
      expect(transitions[0].from).toBe('closed');
      expect(transitions[0].to).toBe('open');
      expect(transitions[1].from).toBe('open');
      expect(transitions[1].to).toBe('half-open');
      expect(transitions[2].from).toBe('half-open');
      expect(transitions[2].to).toBe('closed');
    });
  });
}); 