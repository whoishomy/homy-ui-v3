import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTelemetryFeed } from '@/hooks/useTelemetryFeed';

interface TelemetryChartProps {
  providerId: string;
  className?: string;
}

interface TimeSeriesDataPoint {
  timestamp: number;
  successRate: number;
  responseTime: number;
  healthScore: number;
  errorCount: number;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatValue = (value: string | number | readonly any[] | undefined, type: 'percentage' | 'time' | 'number'): string => {
  if (typeof value !== 'number') return String(value || 0);
  
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'time':
      return `${Math.round(value)}ms`;
    case 'number':
      return value.toString();
    default:
      return String(value);
  }
};

export function TelemetryChart({ providerId, className = '' }: TelemetryChartProps) {
  const { snapshot, error, isLoading } = useTelemetryFeed({
    refreshInterval: 5000,
    provider: providerId,
  });

  const timeSeriesData = useMemo(() => {
    if (!snapshot || !snapshot.providers[providerId]) return [];

    const errorStats = snapshot.errorTimeline || [];
    const providerMetrics = snapshot.providers[providerId];

    // Create a data point for current metrics
    const currentPoint: TimeSeriesDataPoint = {
      timestamp: Date.now(),
      successRate: (1 - providerMetrics.errorRate) * 100,
      responseTime: providerMetrics.latency,
      healthScore: providerMetrics.health,
      errorCount: errorStats[errorStats.length - 1]?.errors || 0,
    };

    // Create historical data points from error timeline
    const historicalPoints: TimeSeriesDataPoint[] = errorStats.map(stat => ({
      timestamp: stat.timestamp,
      successRate: (1 - providerMetrics.errorRate) * 100,
      responseTime: providerMetrics.latency,
      healthScore: providerMetrics.health,
      errorCount: stat.errors,
    }));

    return [...historicalPoints, currentPoint].sort((a, b) => a.timestamp - b.timestamp);
  }, [snapshot, providerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4" role="status">
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
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {providerId} Performance Metrics
      </h3>

      {/* Health Score & Response Time Chart */}
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimestamp}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              labelFormatter={value => new Date(value as number).toLocaleString()}
              formatter={(value, name) => {
                switch (name) {
                  case 'healthScore':
                    return [formatValue(value, 'percentage'), 'Health Score'];
                  case 'responseTime':
                    return [formatValue(value, 'time'), 'Response Time'];
                  default:
                    return [value, name];
                }
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="healthScore"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              name="Health Score"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="responseTime"
              stroke="#9333EA"
              strokeWidth={2}
              dot={false}
              name="Response Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Success Rate & Error Count Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimestamp}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              labelFormatter={value => new Date(value as number).toLocaleString()}
              formatter={(value, name) => {
                switch (name) {
                  case 'successRate':
                    return [formatValue(value, 'percentage'), 'Success Rate'];
                  case 'errorCount':
                    return [formatValue(value, 'number'), 'Error Count'];
                  default:
                    return [value, name];
                }
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="successRate"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Success Rate"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="errorCount"
              stroke="#DC2626"
              fill="#DC2626"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Error Count"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Range Indicator */}
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <span>{formatTimestamp(timeSeriesData[0]?.timestamp || Date.now())}</span>
        <span>{formatTimestamp(timeSeriesData[timeSeriesData.length - 1]?.timestamp || Date.now())}</span>
      </div>
    </div>
  );
} 