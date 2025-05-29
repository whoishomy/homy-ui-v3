'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { VitalStats } from '@/types/health-report';
import { cn } from '@/utils/cn';

interface VitalsHistoryViewProps {
  history?: VitalStats[];
  className?: string;
  isLoading?: boolean;
}

const VitalTrendChart = ({
  data,
  dataKey,
  color,
  yAxisDomain,
}: {
  data: any[];
  dataKey: string;
  color: string;
  yAxisDomain?: [number, number];
}) => (
  <ResponsiveContainer width="100%" height={120}>
    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
      <XAxis
        dataKey="timestamp"
        tickFormatter={(value) => format(new Date(value), 'HH:mm', { locale: tr })}
        stroke="#9CA3AF"
        fontSize={12}
      />
      <YAxis domain={yAxisDomain} stroke="#9CA3AF" fontSize={12} width={25} />
      <Tooltip
        contentStyle={{
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#fff',
        }}
        labelFormatter={(value) => format(new Date(value), 'HH:mm', { locale: tr })}
      />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 4, strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const HistorySkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="h-[120px] bg-gray-100 dark:bg-gray-800 rounded-lg" />
  </div>
);

export const VitalsHistoryView = ({
  history = [],
  className,
  isLoading = false,
}: VitalsHistoryViewProps) => {
  const chartData = useMemo(() => {
    return history.map((vital) => ({
      timestamp: vital.timestamp,
      heartRate: vital.heartRate,
      systolic: vital.bloodPressure?.systolic,
      diastolic: vital.bloodPressure?.diastolic,
      oxygenSaturation: vital.oxygenSaturation,
      bodyTemperature: vital.bodyTemperature,
    }));
  }, [history]);

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <HistorySkeleton />
        <HistorySkeleton />
        <HistorySkeleton />
        <HistorySkeleton />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Henüz geçmiş veri bulunmuyor
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Nabız Trendi</h4>
        <VitalTrendChart
          data={chartData}
          dataKey="heartRate"
          color="#10B981"
          yAxisDomain={[40, 120]}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tansiyon Trendi</h4>
        <VitalTrendChart
          data={chartData}
          dataKey="systolic"
          color="#3B82F6"
          yAxisDomain={[60, 180]}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Oksijen Saturasyonu Trendi
        </h4>
        <VitalTrendChart
          data={chartData}
          dataKey="oxygenSaturation"
          color="#8B5CF6"
          yAxisDomain={[85, 100]}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Vücut Isısı Trendi</h4>
        <VitalTrendChart
          data={chartData}
          dataKey="bodyTemperature"
          color="#EF4444"
          yAxisDomain={[35, 40]}
        />
      </div>
    </div>
  );
};
