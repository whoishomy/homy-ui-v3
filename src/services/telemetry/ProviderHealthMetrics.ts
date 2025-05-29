import type { TelemetryEvent, TelemetrySnapshot } from './InsightTelemetryLogger';
import type { CircuitBreakerState } from '../circuitBreaker/CircuitBreaker';

export interface ProviderHealthScore {
  score: number;              // 0-100 health score
  state: CircuitBreakerState;
  lastFailure?: Date;
  successRate: number;
  avgResponseTime: number;
  failureRate: number;
  circuitBreakerTrips: number;
  recoveryRate: number;      // Successful recovery from half-open state
}

export interface ProviderStateTransition {
  timestamp: number;
  from: CircuitBreakerState;
  to: CircuitBreakerState;
  reason?: string;
}

export interface FallbackMetrics {
  totalFallbacks: number;
  successfulFallbacks: number;
  failedFallbacks: number;
  avgFallbackTime: number;
  fallbackSuccessRate: number;
  providerFallbackMap: Record<string, string[]>; // provider -> fallback providers used
}

export class ProviderHealthMetrics {
  private readonly timeWindowMs: number;

  constructor(options: { timeWindowMs?: number } = {}) {
    this.timeWindowMs = options.timeWindowMs || 24 * 60 * 60 * 1000; // Default: 24 hours
  }

  public getProviderHealthScore(
    provider: string,
    snapshot: TelemetrySnapshot,
    currentTime: number = Date.now()
  ): ProviderHealthScore {
    const events = this.filterRecentEvents(snapshot.events, currentTime);
    const providerEvents = events.filter(e => e.provider === provider);
    
    if (providerEvents.length === 0) {
      return this.getDefaultHealthScore();
    }

    const successRate = this.calculateSuccessRate(providerEvents);
    const avgResponseTime = this.calculateAverageResponseTime(providerEvents);
    const failureRate = 1 - successRate;
    const circuitBreakerTrips = this.countCircuitBreakerTrips(providerEvents);
    const recoveryRate = this.calculateRecoveryRate(providerEvents);
    const currentState = this.getCurrentState(providerEvents);
    const lastFailure = this.getLastFailureTime(providerEvents);

    // Calculate health score based on multiple factors
    const score = this.calculateHealthScore({
      successRate,
      failureRate,
      avgResponseTime,
      circuitBreakerTrips,
      recoveryRate,
    });

    return {
      score,
      state: currentState,
      lastFailure: lastFailure ? new Date(lastFailure) : undefined,
      successRate,
      avgResponseTime,
      failureRate,
      circuitBreakerTrips,
      recoveryRate,
    };
  }

  public getStateTransitions(
    provider: string,
    snapshot: TelemetrySnapshot,
    currentTime: number = Date.now()
  ): ProviderStateTransition[] {
    const events = this.filterRecentEvents(snapshot.events, currentTime)
      .filter(e => e.provider === provider && e.type === 'circuit_breaker_state_change');

    return events.map(e => ({
      timestamp: e.timestamp,
      from: e.metadata?.previousState as CircuitBreakerState,
      to: e.status as CircuitBreakerState,
      reason: e.metadata?.reason,
    }));
  }

  public getFallbackMetrics(
    snapshot: TelemetrySnapshot,
    currentTime: number = Date.now()
  ): FallbackMetrics {
    const events = this.filterRecentEvents(snapshot.events, currentTime);
    const fallbackEvents = events.filter(e => e.type === 'provider_failure' && e.metadata?.nextProvider);

    const totalFallbacks = fallbackEvents.length;
    const successfulFallbacks = fallbackEvents.filter(e => e.metadata?.fallbackSuccess).length;
    const failedFallbacks = totalFallbacks - successfulFallbacks;
    
    const fallbackTimes = fallbackEvents
      .map(e => e.duration)
      .filter((d): d is number => typeof d === 'number');
    
    const avgFallbackTime = fallbackTimes.length > 0
      ? fallbackTimes.reduce((a, b) => a + b, 0) / fallbackTimes.length
      : 0;

    const providerFallbackMap: Record<string, string[]> = {};
    fallbackEvents.forEach(e => {
      const provider = e.provider;
      const nextProvider = e.metadata?.nextProvider;
      if (provider && nextProvider) {
        providerFallbackMap[provider] = providerFallbackMap[provider] || [];
        if (!providerFallbackMap[provider].includes(nextProvider)) {
          providerFallbackMap[provider].push(nextProvider);
        }
      }
    });

    return {
      totalFallbacks,
      successfulFallbacks,
      failedFallbacks,
      avgFallbackTime,
      fallbackSuccessRate: totalFallbacks > 0 ? successfulFallbacks / totalFallbacks : 1,
      providerFallbackMap,
    };
  }

  private filterRecentEvents(events: TelemetryEvent[], currentTime: number): TelemetryEvent[] {
    const cutoffTime = currentTime - this.timeWindowMs;
    return events.filter(e => e.timestamp >= cutoffTime);
  }

  private calculateSuccessRate(events: TelemetryEvent[]): number {
    if (events.length === 0) return 1;
    const successful = events.filter(e => e.status === 'success').length;
    return successful / events.length;
  }

  private calculateAverageResponseTime(events: TelemetryEvent[]): number {
    const durations = events
      .map(e => e.duration)
      .filter((d): d is number => typeof d === 'number');
    
    if (durations.length === 0) return 0;
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  private countCircuitBreakerTrips(events: TelemetryEvent[]): number {
    return events.filter(e => 
      e.type === 'circuit_breaker_state_change' && 
      e.status === 'open'
    ).length;
  }

  private calculateRecoveryRate(events: TelemetryEvent[]): number {
    const recoveryAttempts = events.filter(e => 
      e.type === 'circuit_breaker_state_change' && 
      e.metadata?.previousState === 'half-open'
    );

    if (recoveryAttempts.length === 0) return 1;

    const successfulRecoveries = recoveryAttempts.filter(e => 
      e.status === 'closed'
    ).length;

    return successfulRecoveries / recoveryAttempts.length;
  }

  private getCurrentState(events: TelemetryEvent[]): CircuitBreakerState {
    const stateChanges = events
      .filter(e => e.type === 'circuit_breaker_state_change')
      .sort((a, b) => b.timestamp - a.timestamp);

    return (stateChanges[0]?.status as CircuitBreakerState) || 'closed';
  }

  private getLastFailureTime(events: TelemetryEvent[]): number | undefined {
    const failures = events
      .filter(e => e.status === 'error')
      .sort((a, b) => b.timestamp - a.timestamp);

    return failures[0]?.timestamp;
  }

  private calculateHealthScore(metrics: {
    successRate: number;
    failureRate: number;
    avgResponseTime: number;
    circuitBreakerTrips: number;
    recoveryRate: number;
  }): number {
    // Weights for different factors
    const weights = {
      successRate: 0.4,
      responseTime: 0.2,
      circuitBreaker: 0.2,
      recovery: 0.2,
    };

    // Normalize response time to a 0-1 scale (assuming 5000ms is the worst acceptable time)
    const normalizedResponseTime = Math.max(0, 1 - (metrics.avgResponseTime / 5000));

    // Circuit breaker penalty (each trip reduces score by 10%, up to 50%)
    const circuitBreakerFactor = Math.max(0.5, 1 - (metrics.circuitBreakerTrips * 0.1));

    const score = (
      (metrics.successRate * weights.successRate) +
      (normalizedResponseTime * weights.responseTime) +
      (circuitBreakerFactor * weights.circuitBreaker) +
      (metrics.recoveryRate * weights.recovery)
    ) * 100;

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  private getDefaultHealthScore(): ProviderHealthScore {
    return {
      score: 100,
      state: 'closed',
      successRate: 1,
      avgResponseTime: 0,
      failureRate: 0,
      circuitBreakerTrips: 0,
      recoveryRate: 1,
    };
  }
} 