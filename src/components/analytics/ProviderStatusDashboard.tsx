import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetryFeed } from '@/hooks/useTelemetryFeed';
import { StatusBadge } from './StatusBadge';

interface ProviderStatusDashboardProps {
  providerId: string;
  className?: string;
}

type ProviderStatus = 'up' | 'degraded' | 'down';

interface TelemetrySnapshot {
  providers: Record<string, {
    health: number;
    latency: number;
    errorRate: number;
  }>;
  errorTimeline: Array<{
    timestamp: number;
    errors: number;
  }>;
}

const getStatusFromHealth = (health: number): ProviderStatus => {
  if (health >= 90) return 'up';
  if (health >= 70) return 'degraded';
  return 'down';
};

const getStatusColor = (status: ProviderStatus): string => {
  switch (status) {
    case 'up':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'down':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export function ProviderStatusDashboard({ providerId, className = '' }: ProviderStatusDashboardProps) {
  const { snapshot, error, isLoading } = useTelemetryFeed({
    refreshInterval: 5000, // 5 seconds
    provider: providerId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4" role="status">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
          aria-label="Loading provider status"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="p-4 bg-red-50 text-red-700 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        <p>Error loading provider status: {error.message}</p>
      </div>
    );
  }

  const providerData = snapshot.providers[providerId];
  if (!providerData) {
    return (
      <div 
        className="p-4 bg-yellow-50 text-yellow-700 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        <p>No data available for provider: {providerId}</p>
      </div>
    );
  }

  const { health: providerHealth, latency: avgLatency, errorRate } = providerData;
  const status = getStatusFromHealth(providerHealth);
  const statusColor = getStatusColor(status);

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      role="region"
      aria-label={`${providerId} Status Dashboard`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{providerId} Status</h2>
          <p className="text-sm text-gray-500">Last 24 hours performance</p>
        </div>
        <StatusBadge
          status={status}
          className={statusColor}
          tooltip={`Health Score: ${providerHealth}%`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Health Score</p>
          <p className="text-2xl font-bold text-gray-900">{providerHealth}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Avg. Latency</p>
          <p className="text-2xl font-bold text-gray-900">{avgLatency.toFixed(0)}ms</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Error Rate</p>
          <p className="text-2xl font-bold text-gray-900">
            {(errorRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-48" role="img" aria-label="Error rate timeline chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={snapshot.errorTimeline}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
              }}
              aria-label="Time"
            />
            <YAxis aria-label="Number of errors" />
            <Tooltip
              labelFormatter={(value) => new Date(value as number).toLocaleString()}
              formatter={(value: number) => [`${value}`, 'Errors']}
            />
            <Area
              type="monotone"
              dataKey="errors"
              stroke="#EF4444"
              fill="#FEE2E2"
              strokeWidth={2}
              name="Error count"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 