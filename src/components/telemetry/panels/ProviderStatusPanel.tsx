import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/solid';
import { StatusBadge } from '@/components/analytics/StatusBadge';
import type { TelemetrySnapshot } from '@/hooks/useTelemetryFeed';

interface ProviderStatusPanelProps {
  providers?: TelemetrySnapshot['providers'];
  className?: string;
}

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  trend?: number;
  className?: string;
}

const MetricCard = ({ label, value, unit, trend, className = '' }: MetricCardProps) => (
  <div 
    className={`bg-white rounded-lg shadow-sm p-4 ${className}`}
    role="group"
    aria-label={`${label} metriği`}
  >
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">
        {value.toFixed(1)}
      </p>
      <p className="ml-2 text-sm text-gray-500">{unit}</p>
    </div>
    {trend !== undefined && (
      <div className="mt-2 flex items-center">
        {trend >= 0 ? (
          <TrendingUpIcon className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDownIcon className="w-4 h-4 text-red-500" />
        )}
        <span 
          className={`text-sm ml-1 ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>
    )}
  </div>
);

export default function ProviderStatusPanel({ providers = {}, className = '' }: ProviderStatusPanelProps) {
  return (
    <div 
      className={`bg-gray-50 rounded-xl p-6 ${className}`}
      role="region"
      aria-label="Sağlayıcı Durumu"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Sağlayıcı Durumu
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(providers).map(([providerId, metrics]) => (
          <div 
            key={providerId}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {providerId}
              </h3>
              <StatusBadge
                status={metrics.health >= 90 ? 'up' : metrics.health >= 70 ? 'degraded' : 'down'}
                tooltip={`Sağlık Skoru: ${metrics.health}%`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                label="Yanıt Süresi"
                value={metrics.latency}
                unit="ms"
                trend={-5.2} // TODO: Calculate from historical data
              />
              <MetricCard
                label="Hata Oranı"
                value={metrics.errorRate * 100}
                unit="%"
                trend={2.1} // TODO: Calculate from historical data
              />
              <MetricCard
                label="Başarı Oranı"
                value={metrics.successRate * 100}
                unit="%"
              />
              <MetricCard
                label="Toplam İstek"
                value={metrics.totalRequests}
                unit="istek"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 