'use client';

import { FC, useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface DataTrendChartProps {
  data: DataPoint[];
  currentValue: number;
  referenceRange: [number, number];
  height?: number;
}

export const DataTrendChart: FC<DataTrendChartProps> = ({
  data,
  currentValue,
  referenceRange,
  height = 40,
}) => {
  const [min, max] = referenceRange;

  // Calculate chart boundaries with 10% padding
  const chartMin = useMemo(() => {
    const lowestValue = Math.min(...data.map((d) => d.value), min);
    const padding = (max - min) * 0.1;
    return Math.max(0, lowestValue - padding);
  }, [data, min, max]);

  const chartMax = useMemo(() => {
    const highestValue = Math.max(...data.map((d) => d.value), max);
    const padding = (max - min) * 0.1;
    return highestValue + padding;
  }, [data, min, max]);

  const isOutOfRange = currentValue < min || currentValue > max;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {/* Reference range area */}
          <YAxis domain={[chartMin, chartMax]} hide allowDataOverflow />

          {/* Reference lines */}
          <Line
            type="monotone"
            dataKey="value"
            stroke={isOutOfRange ? '#ef4444' : '#22c55e'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
