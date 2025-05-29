'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { LabResult, LabResultHistory, LabResultStatus } from '@/types/lab-results';
import { LabResultTrendChart } from './LabResultTrendChart';
import { LabResultDetailView } from './LabResultDetailView';

interface LabResultCardProps {
  result?: LabResult;
  history?: LabResultHistory;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const ResultSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="space-y-2">
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const StatusIcon = ({ status }: { status: LabResultStatus }) => {
  switch (status) {
    case 'normal':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'critical_low':
    case 'critical_high':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'low':
    case 'high':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return null;
  }
};

const StatusText = ({ status }: { status: LabResultStatus }) => {
  const className = cn('text-sm font-medium', {
    'text-green-500': status === 'normal',
    'text-red-500': status === 'critical_low' || status === 'critical_high',
    'text-yellow-500': status === 'low' || status === 'high',
  });

  let text = '';
  switch (status) {
    case 'normal':
      text = 'Normal';
      break;
    case 'critical_low':
      text = 'Kritik Düşük';
      break;
    case 'critical_high':
      text = 'Kritik Yüksek';
      break;
    case 'low':
      text = 'Düşük';
      break;
    case 'high':
      text = 'Yüksek';
      break;
    default:
      text = 'Bilinmiyor';
  }

  return <span className={className}>{text}</span>;
};

export const LabResultCard = ({
  result,
  history,
  className,
  isLoading = false,
  onClick,
}: LabResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  if (isLoading || !result) {
    return (
      <div
        className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}
      >
        <ResultSkeleton />
      </div>
    );
  }

  const { testName, value, unit, referenceRange, status, date, laboratory } = result;

  return (
    <>
      <div
        className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{testName}</h3>
              <button
                onClick={onClick}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                       dark:hover:bg-gray-700 transition-colors"
                aria-label="Detayları göster"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(date), 'PPP', { locale: tr })} • {laboratory}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                     dark:hover:bg-gray-700 transition-colors"
            aria-label={isExpanded ? 'Küçült' : 'Genişlet'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIcon status={status} />
              <StatusText status={status} />
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {history?.history && history.history.length > 0 && (
                <div className="h-32">
                  <LabResultTrendChart
                    data={history.history.map((h) => ({ date: h.date, value: h.value }))}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <LabResultDetailView
        result={result}
        history={history}
        isOpen={showDetail}
        onCloseAction={() => setShowDetail(false)}
      />
    </>
  );
};
