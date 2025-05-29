'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/utils/cn';

interface DataPoint {
  date: string;
  value: number;
}

interface LabResultTrendChartProps {
  data: DataPoint[];
  className?: string;
}

const TrendSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg" />
  </div>
);

export const LabResultTrendChart = ({ data, className }: LabResultTrendChartProps) => {
  const { min, max } = useMemo(() => {
    const values = data.map((d) => d.value);
    return {
      min: Math.min(...values) * 0.9,
      max: Math.max(...values) * 1.1,
    };
  }, [data]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sonuç Trendi</h4>
        <div className="text-xs text-gray-500 dark:text-gray-400">Son {data.length} ölçüm</div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => format(new Date(value), 'd MMM', { locale: tr })}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis domain={[min, max]} stroke="#9CA3AF" fontSize={12} width={35} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              labelFormatter={(value: string) => format(new Date(value), 'PPP', { locale: tr })}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{
                stroke: '#3B82F6',
                strokeWidth: 2,
                r: 4,
                fill: '#fff',
              }}
              activeDot={{
                stroke: '#3B82F6',
                strokeWidth: 2,
                r: 6,
                fill: '#fff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
