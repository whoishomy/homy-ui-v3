'use client';

import { FC } from 'react';
import { LabResult } from '@/modules/lab-results/types/lab-result';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { DataTrendChart } from './DataTrendChart';

type LabResultCardProps = {
  data: LabResult;
};

export const LabResultCard: FC<LabResultCardProps> = ({ data }) => {
  const isOutOfRange = data.result < data.referenceRange[0] || data.result > data.referenceRange[1];

  return (
    <div
      className={cn(
        'rounded-2xl p-4 shadow-md ring-1',
        isOutOfRange ? 'ring-red-500 bg-red-50' : 'ring-green-500 bg-green-50'
      )}
      role="region"
      aria-label={`Lab result for ${data.testName}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{data.testName}</h2>
        {isOutOfRange ? (
          <AlertCircle className="text-red-600" aria-hidden data-testid="alert-circle" />
        ) : (
          <CheckCircle className="text-green-600" aria-hidden data-testid="check-circle" />
        )}
      </div>

      <div className="space-y-1">
        <p>
          <span className="font-medium">Result:</span> {data.result} {data.unit}
        </p>
        <p>
          <span className="font-medium">Reference Range:</span> {data.referenceRange[0]} –{' '}
          {data.referenceRange[1]} {data.unit}
        </p>
        <p>
          <span className="font-medium">Date:</span> {format(new Date(data.date), 'PPP')}
        </p>
        {data.insightComment && (
          <p className="mt-2 italic text-sm text-gray-700">💡 {data.insightComment}</p>
        )}
      </div>

      <div className="mt-4">
        <DataTrendChart
          data={data.trendData}
          currentValue={data.result}
          referenceRange={data.referenceRange}
          height={40}
        />
      </div>
    </div>
  );
};
