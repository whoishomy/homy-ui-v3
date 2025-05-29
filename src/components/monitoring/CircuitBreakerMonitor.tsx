import React from 'react';
import { useTelemetryFeed } from '@/hooks/useTelemetryFeed';
import { InMemoryTelemetryLogger } from '@/services/telemetry/InsightTelemetryLogger';
import type { CircuitBreakerState } from '@/services/circuitBreaker/CircuitBreaker';
import type { ProviderMetrics } from '@/services/telemetry/InsightTelemetry';

interface CircuitBreakerMonitorProps {
  telemetryLogger: InMemoryTelemetryLogger;
  className?: string;
  selectedProvider?: string;
  onProviderSelect?: (provider: string) => void;
}

const stateColors: Record<CircuitBreakerState, string> = {
  closed: 'bg-green-500',
  open: 'bg-red-500',
  'half-open': 'bg-yellow-500',
};

const stateLabels: Record<CircuitBreakerState, string> = {
  closed: 'Healthy',
  open: 'Circuit Open',
  'half-open': 'Testing',
};

export function CircuitBreakerMonitor({
  telemetryLogger,
  className = '',
  selectedProvider,
  onProviderSelect,
}: CircuitBreakerMonitorProps) {
  const { snapshot, isLoading, error } = useTelemetryFeed({
    refreshInterval: 5000,
    provider: selectedProvider,
  });

  const providers = snapshot?.providers || {};
  const providerMetrics = snapshot?.insights?.byProvider || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error loading telemetry data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Circuit Breaker Status</h2>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(providers).map(([provider, metrics]) => (
          <div
            key={provider}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => onProviderSelect?.(provider)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onProviderSelect?.(provider);
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stateColors['closed']}`} />
                <h3 className="font-medium text-gray-900">{provider}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {stateLabels['closed']}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-500">Score: {metrics.health}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-500">
              <div>
                <p>Success Rate: {(metrics.successRate * 100).toFixed(1)}%</p>
                <p>Avg Response: {metrics.latency.toFixed(0)}ms</p>
              </div>
              <div>
                <p>Total Requests: {metrics.totalRequests}</p>
                <p>Error Rate: {(metrics.errorRate * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Provider Metrics */}
            {providerMetrics[provider] && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Additional Metrics:</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p>
                      Cache Hit Rate: {(providerMetrics[provider].cacheHitRate * 100).toFixed(1)}%
                    </p>
                    <p>Avg Duration: {providerMetrics[provider].averageDuration.toFixed(0)}ms</p>
                  </div>
                  <div>
                    <p>Total Generated: {providerMetrics[provider].total}</p>
                    <p>Success Rate: {(providerMetrics[provider].successRate * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
