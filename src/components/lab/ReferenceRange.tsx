'use client';

import { cn } from '@/utils/cn';
import { LabResult } from '@/types/lab-results';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ReferenceRangeProps {
  result: LabResult;
  className?: string;
  showStatusBadge?: boolean;
}

const StatusBadge = ({ status }: { status: LabResult['status'] }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'normal':
        return {
          icon: CheckCircle,
          text: 'Normal',
          className: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        };
      case 'low':
        return {
          icon: AlertTriangle,
          text: 'Düşük',
          className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          text: 'Yüksek',
          className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
      case 'critical_low':
        return {
          icon: XCircle,
          text: 'Kritik Düşük',
          className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
      case 'critical_high':
        return {
          icon: XCircle,
          text: 'Kritik Yüksek',
          className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
      default:
        return {
          icon: AlertTriangle,
          text: 'Bilinmiyor',
          className: 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        config.className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

export const ReferenceRange = ({
  result,
  className,
  showStatusBadge = true,
}: ReferenceRangeProps) => {
  const { value, referenceRange, status } = result;
  const { min, max, unit, ageSpecific, genderSpecific } = referenceRange;

  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'text-green-500';
      case 'low':
      case 'high':
        return 'text-yellow-500';
      case 'critical_low':
      case 'critical_high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Normalize value to percentage for visualization
  const range = max - min;
  const padding = range * 0.2; // Add 20% padding on each side
  const minWithPadding = min - padding;
  const maxWithPadding = max + padding;
  const totalRange = maxWithPadding - minWithPadding;
  const valuePercentage = ((value - minWithPadding) / totalRange) * 100;
  const normalRangeStart = ((min - minWithPadding) / totalRange) * 100;
  const normalRangeEnd = ((max - minWithPadding) / totalRange) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Reference Range Bar */}
      <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        {/* Normal Range Zone */}
        <div
          className="absolute inset-y-0 bg-green-100 dark:bg-green-900/30"
          style={{
            left: `${normalRangeStart}%`,
            right: `${100 - normalRangeEnd}%`,
          }}
        />
        {/* Current Value Indicator */}
        <div
          className={cn(
            'absolute inset-y-0 w-2 -ml-1 rounded-full transition-all duration-300',
            status === 'normal'
              ? 'bg-green-500'
              : status.includes('critical')
              ? 'bg-red-500'
              : 'bg-yellow-500'
          )}
          style={{
            left: `${valuePercentage}%`,
          }}
        />
      </div>

      {/* Range Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500 dark:text-gray-400">
          <span>{min}</span>
          <span className="mx-1">-</span>
          <span>{max}</span>
          <span className="ml-1">{unit}</span>
        </div>
        {showStatusBadge && <StatusBadge status={status} />}
      </div>

      {/* Additional Info */}
      {(ageSpecific || genderSpecific) && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {[
            ageSpecific && 'Yaşa özel referans aralığı',
            genderSpecific && 'Cinsiyete özel referans aralığı',
          ]
            .filter(Boolean)
            .join(' • ')}
        </div>
      )}
    </div>
  );
};
