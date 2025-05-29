import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import type { TelemetrySnapshot } from '@/hooks/useTelemetryFeed';

interface InsightUsageChartProps {
  data?: TelemetrySnapshot['insights'];
  className?: string;
}

// Insight türleri için renk paleti
const INSIGHT_COLORS = {
  nutrition: '#10B981', // Yeşil
  exercise: '#3B82F6', // Mavi
  sleep: '#8B5CF6', // Mor
  stress: '#F59E0B', // Turuncu
  general: '#6B7280', // Gri
};

interface InsightData {
  type: keyof typeof INSIGHT_COLORS;
  count: number;
  percentage: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as InsightData;
  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
      <p className="text-sm font-medium text-gray-600">
        {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
      </p>
      <div className="mt-1">
        <p className="text-sm font-semibold text-gray-900">
          {data.count.toLocaleString('tr-TR')} kullanım
        </p>
        <p className="text-xs text-gray-500">Toplam kullanımın %{data.percentage.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default function InsightUsageChart({ data, className = '' }: InsightUsageChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const mockUsageData = {
      nutrition: Math.round(data.totalGenerated * 0.35),
      exercise: Math.round(data.totalGenerated * 0.25),
      sleep: Math.round(data.totalGenerated * 0.2),
      stress: Math.round(data.totalGenerated * 0.15),
      general: Math.round(data.totalGenerated * 0.05),
    };

    return Object.entries(mockUsageData).map(([type, count]) => ({
      type,
      count,
      percentage: (count / data.totalGenerated) * 100,
    }));
  }, [data]);

  if (!data || chartData.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg p-6 ${className}`}
        role="region"
        aria-label="Insight kullanım grafiği - Veri yok"
      >
        <p className="text-gray-500 text-sm">Henüz insight kullanım verisi bulunmuyor</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg p-6 ${className}`}
      role="region"
      aria-label="Insight kullanım grafiği"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Insight Kullanım Dağılımı</h3>
        <div className="text-sm text-gray-500">
          Toplam: {data.totalGenerated.toLocaleString('tr-TR')}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey="type"
              tick={({ payload, x, y }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill="#6B7280"
                  fontSize={12}
                  className="capitalize"
                >
                  {payload.value}
                </text>
              )}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={INSIGHT_COLORS[entry.type as keyof typeof INSIGHT_COLORS]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ortalama Gecikme ve Cache Hit Oranı */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Ortalama Gecikme</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {data.averageDuration.toFixed(1)}ms
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Cache Hit Oranı</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            %{(data.cacheHitRate * 100).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
