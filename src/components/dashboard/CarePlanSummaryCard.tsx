'use client';

import { CalendarDays, Pill, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CarePlan } from '@/types/carePlan';
import { cn } from '@/utils/cn';

interface CarePlanSummaryCardProps {
  plan?: CarePlan;
  className?: string;
  onViewDetails?: () => void;
  isLoading?: boolean;
}

const StatusBadge = ({ status }: { status: CarePlan['status'] }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MetricSkeleton = () => (
  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse">
    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mb-1" />
    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

export const CarePlanSummaryCard = ({
  plan,
  className,
  onViewDetails,
  isLoading = false,
}: CarePlanSummaryCardProps) => {
  if (isLoading || !plan) {
    return (
      <div
        className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>

        <div className="w-full h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.title}</h3>
          <div className="mt-1 flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(plan.startDate), 'd MMMM yyyy', { locale: tr })}
            </p>
          </div>
        </div>
        <StatusBadge status={plan.status} />
      </div>

      <div className="grid grid-cols-3 gap-4 py-2">
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Pill className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {plan.medications.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">İlaç</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Clock className="w-5 h-5 text-purple-500 mb-1" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {plan.appointments.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Randevu</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Target className="w-5 h-5 text-green-500 mb-1" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {plan.goals.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Hedef</span>
        </div>
      </div>

      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full mt-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Detayları Görüntüle
        </button>
      )}
    </div>
  );
};
