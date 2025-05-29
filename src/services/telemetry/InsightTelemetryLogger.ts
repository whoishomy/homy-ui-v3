import type { HealthInsight } from '@/types/analytics';
import type { CircuitBreakerState } from '../circuitBreaker/CircuitBreaker';
import type { InsightOperation } from '@/types/analytics';

export type TelemetryEventType = 
  | 'insight_generation'
  | 'retry_attempt'
  | 'retry_success'
  | 'retry_failure'
  | 'circuit_breaker_state_change'
  | 'circuit_breaker_failure'
  | 'provider_failure';

export type TelemetryEventStatus = 'success' | 'error' | CircuitBreakerState;

export interface TelemetryError {
  message: string;
  type: string;
  stack?: string;
}

export interface TelemetryEvent {
  type: TelemetryEventType;
  status: TelemetryEventStatus;
  provider: string;
  timestamp: number;
  duration?: number;
  operation?: InsightOperation;
  error?: TelemetryError;
  metadata?: {
    previousState?: CircuitBreakerState;
    nextProvider?: string;
    fallbackSuccess?: boolean;
    reason?: string;
    [key: string]: unknown;
  };
}

export interface TelemetryMetrics {
  totalEvents: number;
  successCount: number;
  errorCount: number;
  avgDuration: number;
  providerStats: {
    [provider: string]: {
      totalCalls: number;
      successRate: number;
      avgDuration: number;
      lastError?: TelemetryError;
    };
  };
}

export interface TelemetrySnapshot {
  events: TelemetryEvent[];
  metrics: TelemetryMetrics;
}

export interface TelemetryLogger {
  logEvent(event: TelemetryEvent): void;
  getSnapshot(timeRange?: { start: Date; end: Date }): TelemetrySnapshot;
  clear(): void;
}

export class InMemoryTelemetryLogger implements TelemetryLogger {
  private events: TelemetryEvent[] = [];
  private readonly maxEvents: number;

  constructor(options: { maxEvents?: number } = {}) {
    this.maxEvents = options.maxEvents ?? 1000;
  }

  logEvent(event: TelemetryEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift(); // Remove oldest event when limit is reached
    }
  }

  getSnapshot(timeRange?: { start: Date; end: Date }): TelemetrySnapshot {
    const filteredEvents = this.filterEventsByTimeRange(timeRange);
    const metrics = this.calculateMetrics(filteredEvents);

    return {
      events: filteredEvents,
      metrics,
    };
  }

  clear(): void {
    this.events = [];
  }

  private filterEventsByTimeRange(timeRange?: { start: Date; end: Date }): TelemetryEvent[] {
    if (!timeRange) {
      return [...this.events];
    }

    const startTime = timeRange.start.getTime();
    const endTime = timeRange.end.getTime();

    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  private calculateMetrics(events: TelemetryEvent[]): TelemetryMetrics {
    const metrics: TelemetryMetrics = {
      totalEvents: events.length,
      successCount: 0,
      errorCount: 0,
      avgDuration: 0,
      providerStats: {},
    };

    let totalDuration = 0;
    let eventsWithDuration = 0;

    events.forEach(event => {
      // Update success/error counts
      if (event.status === 'success') {
        metrics.successCount++;
      } else if (event.status === 'error') {
        metrics.errorCount++;
      }

      // Update duration metrics
      if (event.duration) {
        totalDuration += event.duration;
        eventsWithDuration++;
      }

      // Update provider stats
      if (!metrics.providerStats[event.provider]) {
        metrics.providerStats[event.provider] = {
          totalCalls: 0,
          successRate: 0,
          avgDuration: 0,
        };
      }

      const providerStats = metrics.providerStats[event.provider];
      providerStats.totalCalls++;

      if (event.duration) {
        providerStats.avgDuration = (
          (providerStats.avgDuration * (providerStats.totalCalls - 1) + event.duration) /
          providerStats.totalCalls
        );
      }

      if (event.status === 'success') {
        providerStats.successRate = (
          (providerStats.successRate * (providerStats.totalCalls - 1) + 1) /
          providerStats.totalCalls
        );
      }

      if (event.error) {
        providerStats.lastError = event.error;
      }
    });

    metrics.avgDuration = eventsWithDuration > 0 ? totalDuration / eventsWithDuration : 0;

    return metrics;
  }
} 