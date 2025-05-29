'use client';

import { DataTrendChart } from './DataTrendChart';

interface LabResultCardProps {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'low' | 'normal' | 'high';
  date: string;
  trend: Array<{ date: string; value: number }>;
}

export function LabResultCard({
  name,
  value,
  unit,
  referenceRange,
  status,
  date,
  trend,
}: LabResultCardProps) {
  const statusColors = {
    low: 'text-red-600',
    normal: 'text-green-600',
    high: 'text-orange-600',
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-gray-600">{unit}</span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Reference Range: {referenceRange} {unit}
          </div>
          <div className={`mt-2 font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        <div className="text-sm text-gray-600">{date}</div>
      </div>
      <div className="mt-6 h-32">
        <DataTrendChart data={trend} />
      </div>
    </div>
  );
}
