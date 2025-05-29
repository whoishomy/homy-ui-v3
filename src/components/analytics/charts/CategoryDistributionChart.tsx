'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type CategoryData = {
  name: string;
  value: number;
  color: string;
};

type CategoryDistributionChartProps = {
  data?: CategoryData[];
  height?: number;
};

const mockData = [
  { name: 'Exercise', value: 35, color: '#0ea5e9' },
  { name: 'Nutrition', value: 25, color: '#22c55e' },
  { name: 'Sleep', value: 20, color: '#6366f1' },
  { name: 'Stress', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#64748b' },
];

const COLORS = ['#1A866D', '#F7B32B', '#4F7CAC', '#FF6B6B', '#8884d8'];

export function CategoryDistributionChart({
  data = mockData,
  height = 280,
}: CategoryDistributionChartProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
      aria-label="Category distribution chart"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Category Distribution
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Health score breakdown by category
        </p>
      </div>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              formatter={(value: number) => [`${value}%`, 'Percentage']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
