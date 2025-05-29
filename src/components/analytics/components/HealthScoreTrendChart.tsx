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
} from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { TrendData } from '@/types/analytics';

interface HealthScoreTrendChartProps {
  data: TrendData[];
}

export const HealthScoreTrendChart: React.FC<HealthScoreTrendChartProps> = ({
  data,
}) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date), 'dd MMM', { locale: tr }),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
            }}
            labelStyle={{ color: '#111827' }}
            itemStyle={{ color: '#6B7280' }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '1rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Sağlık Skoru"
            stroke="#10B981"
            strokeWidth={2}
            dot={{
              fill: '#10B981',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: '#10B981',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 6,
            }}
          />
          {data[0]?.target && (
            <Line
              type="monotone"
              dataKey="target"
              name="Hedef"
              stroke="#6B7280"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 