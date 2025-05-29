import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ExclamationIcon } from '@heroicons/react/solid';
import type { TelemetrySnapshot } from '@/hooks/useTelemetryFeed';

interface FallbackRateChartProps {
  data?: TelemetrySnapshot['providers'];
  className?: string;
}

// Fallback nedenleri için renk paleti
const FALLBACK_COLORS = {
  timeout: '#EF4444',     // Kırmızı
  error: '#F59E0B',      // Turuncu
  rateLimit: '#8B5CF6',  // Mor
  capacity: '#3B82F6',   // Mavi
  other: '#6B7280',      // Gri
};

interface FallbackData {
  reason: keyof typeof FALLBACK_COLORS;
  count: number;
  percentage: number;
  provider: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as FallbackData;
  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: FALLBACK_COLORS[data.reason] }}
        />
        <p className="text-sm font-medium text-gray-600 capitalize">
          {data.reason}
        </p>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm font-semibold text-gray-900">
          {data.count.toLocaleString('tr-TR')} fallback
        </p>
        <p className="text-xs text-gray-500">
          Toplam fallback'lerin %{data.percentage.toFixed(1)}'i
        </p>
        <p className="text-xs text-gray-500">
          Provider: {data.provider}
        </p>
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="grid grid-cols-2 gap-2 text-sm">
    {payload.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-gray-600 capitalize">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function FallbackRateChart({ data = {}, className = '' }: FallbackRateChartProps) {
  const { chartData, totalFallbacks, successRate } = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return { chartData: [], totalFallbacks: 0, successRate: 0 };
    }

    // Mock fallback data - gerçek implementasyonda API'den gelecek
    const mockFallbackData = {
      timeout: {
        count: 150,
        provider: 'openai',
      },
      error: {
        count: 89,
        provider: 'anthropic',
      },
      rateLimit: {
        count: 67,
        provider: 'openai',
      },
      capacity: {
        count: 45,
        provider: 'cohere',
      },
      other: {
        count: 23,
        provider: 'various',
      },
    };

    const total = Object.values(mockFallbackData).reduce((sum, { count }) => sum + count, 0);
    
    // Başarı oranını hesapla
    const totalRequests = Object.values(data).reduce((sum, provider) => sum + provider.totalRequests, 0);
    const successRateCalc = ((totalRequests - total) / totalRequests) * 100;

    const chartDataCalc = Object.entries(mockFallbackData).map(([reason, info]) => ({
      reason,
      count: info.count,
      percentage: (info.count / total) * 100,
      provider: info.provider,
    }));

    return {
      chartData: chartDataCalc,
      totalFallbacks: total,
      successRate: successRateCalc,
    };
  }, [data]);

  if (Object.keys(data).length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg p-6 ${className}`}
        role="region"
        aria-label="Fallback oranları grafiği - Veri yok"
      >
        <p className="text-gray-500 text-sm">
          Henüz fallback verisi bulunmuyor
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg p-6 ${className}`}
      role="region"
      aria-label="Fallback oranları grafiği"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Fallback Analizi
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Son 24 saatteki provider fallback dağılımı
          </p>
        </div>
        {successRate < 95 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <ExclamationIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Yüksek Fallback Oranı</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="reason"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.reason}
                    fill={FALLBACK_COLORS[entry.reason as keyof typeof FALLBACK_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Metrikler */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Toplam Fallback</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {totalFallbacks.toLocaleString('tr-TR')}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Başarı Oranı</p>
            <p className={`text-2xl font-semibold mt-1 ${
              successRate >= 95 ? 'text-green-600' : 'text-amber-600'
            }`}>
              %{successRate.toFixed(1)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">En Sık Fallback</p>
            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
              {chartData[0]?.reason || '-'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {chartData[0]?.provider || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 