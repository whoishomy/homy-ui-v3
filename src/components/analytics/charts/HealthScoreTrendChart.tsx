'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type HealthScoreTrendChartProps = {
  data?: { date: string; score: number }[];
  viewMode?: 'daily' | 'weekly';
  height?: number;
};

// Mock data for development
const mockData = [
  { date: '2024-05-20', score: 85 },
  { date: '2024-05-21', score: 83 },
  { date: '2024-05-22', score: 87 },
  { date: '2024-05-23', score: 89 },
  { date: '2024-05-24', score: 92 },
  { date: '2024-05-25', score: 90 },
  { date: '2024-05-26', score: 87 },
];

export function HealthScoreTrendChart({
  data = mockData,
  viewMode = 'daily',
  height = 280,
}: HealthScoreTrendChartProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
      aria-label="Health score trend chart"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Health Score</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">7-day trend analysis</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">87</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Current Score</div>
        </div>
      </div>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => (viewMode === 'daily' ? date.slice(5) : date)}
              fontSize={12}
              stroke="#6B7280"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              fontSize={12}
              stroke="#6B7280"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              formatter={(value: number) => [`${value}`, 'Health Score']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine
              y={80}
              stroke="#22c55e"
              strokeDasharray="3 3"
              label={{
                value: 'Target: 80',
                fill: '#22c55e',
                fontSize: 12,
                position: 'right',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: '#0ea5e9',
                strokeWidth: 2,
                stroke: '#fff',
              }}
              activeDot={{
                r: 6,
                fill: '#0ea5e9',
                strokeWidth: 2,
                stroke: '#fff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
