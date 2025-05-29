import { useMemo } from 'react';
import type { TelemetryEvent } from '@/services/telemetry/InsightTelemetryLogger';
import type { CircuitBreakerState } from '@/services/circuitBreaker/CircuitBreaker';

interface FormattedEvent {
  id: string;
  timestamp: number;
  type: 'state_change' | 'fallback' | 'error' | 'recovery';
  status: 'success' | 'warning' | 'error' | 'info';
  provider: string;
  title: string;
  description: string;
}

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const getEventDescription = (event: TelemetryEvent): string => {
  switch (event.type) {
    case 'circuit_breaker_state_change':
      return `Provider entered ${event.status} state${
        event.metadata?.reason ? ` - ${event.metadata.reason}` : ''
      }`;

    case 'provider_failure':
      return event.metadata?.fallbackSuccess
        ? `Successfully failed over to ${event.metadata.nextProvider}`
        : `Failed to fall back to ${event.metadata?.nextProvider}`;

    case 'retry_attempt':
      return `Retry attempt ${event.metadata?.attempt || 1} of ${event.metadata?.maxAttempts || '?'}`;

    case 'retry_success':
      return 'Operation succeeded after retry';

    case 'retry_failure':
      return 'Operation failed after all retry attempts';

    default:
      return event.error?.message || 'Unknown event';
  }
};

const getEventStatus = (event: TelemetryEvent): FormattedEvent['status'] => {
  if (event.status === 'success') return 'success';
  if (event.status === 'error') return 'error';
  
  if (event.type === 'circuit_breaker_state_change') {
    switch (event.status as CircuitBreakerState) {
      case 'open': return 'error';
      case 'half-open': return 'warning';
      case 'closed': return 'success';
    }
  }

  if (event.type === 'provider_failure') {
    return event.metadata?.fallbackSuccess ? 'warning' : 'error';
  }

  if (event.type.startsWith('retry_')) {
    return event.type === 'retry_success' ? 'success' : 'warning';
  }

  return 'info';
};

const getEventTitle = (event: TelemetryEvent): string => {
  switch (event.type) {
    case 'circuit_breaker_state_change':
      return `Circuit ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}`;
    
    case 'provider_failure':
      return event.metadata?.fallbackSuccess ? 'Fallback Success' : 'Fallback Failure';
    
    case 'retry_attempt':
      return 'Retry Attempt';
    
    case 'retry_success':
      return 'Retry Success';
    
    case 'retry_failure':
      return 'Retry Failure';
    
    default:
      return event.type.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

export function useRecentEvents(events: TelemetryEvent[], limit: number = 10): FormattedEvent[] {
  return useMemo(() => {
    return events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(event => ({
        id: `${event.type}-${event.timestamp}-${event.provider}`,
        timestamp: event.timestamp,
        type: event.type === 'circuit_breaker_state_change'
          ? 'state_change'
          : event.type === 'provider_failure'
          ? 'fallback'
          : event.type.startsWith('retry_')
          ? 'recovery'
          : 'error',
        status: getEventStatus(event),
        provider: event.provider,
        title: getEventTitle(event),
        description: getEventDescription(event),
      }));
  }, [events, limit]);
} 