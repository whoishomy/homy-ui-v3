import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TelemetrySnapshot } from '@/hooks/useTelemetryFeed';

interface ErrorTimelineChartProps {
  data?: TelemetrySnapshot['errorTimeline'];
  className?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
      <p className="text-sm font-medium text-gray-600">
        {new Date(label).toLocaleString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </p>
      <p className="text-sm font-semibold text-red-600 mt-1">
        {payload[0].value} hata
      </p>
    </div>
  );
};

export default function ErrorTimelineChart({ data = [], className = '' }: ErrorTimelineChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      formattedTime: formatTimestamp(point.timestamp),
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg p-6 ${className}`}
        role="region"
        aria-label="Hata zaman çizelgesi - Veri yok"
      >
        <p className="text-gray-500 text-sm">
          Henüz hata verisi bulunmuyor
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg p-6 ${className}`}
      role="region"
      aria-label="Hata zaman çizelgesi grafiği"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Hata Zaman Çizelgesi
      </h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="formattedTime"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              allowDecimals={false}
              label={{ 
                value: 'Hata Sayısı',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6B7280', fontSize: 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="errors"
              name="Hatalar"
              stroke="#EF4444"
              fill="url(#errorGradient)"
              strokeWidth={2}
              dot={{ stroke: '#EF4444', fill: '#FFF', strokeWidth: 2, r: 4 }}
              activeDot={{ stroke: '#EF4444', fill: '#FFF', strokeWidth: 2, r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 