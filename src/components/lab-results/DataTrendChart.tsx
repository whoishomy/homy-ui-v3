'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataTrendChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export function DataTrendChart({ data }: DataTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
          fontSize={12}
          tick={{ fill: '#666' }}
        />
        <YAxis fontSize={12} tick={{ fill: '#666' }} />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          contentStyle={{ background: 'white', border: '1px solid #ddd' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: '#2563eb', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
