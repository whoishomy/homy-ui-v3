'use client';

import { useState } from 'react';
import { Heart, Thermometer, Wind, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { VitalStats } from '@/types/health-report';
import { VitalsHistoryView } from './VitalsHistoryView';

interface VitalsCardProps {
  vitals?: VitalStats;
  history?: VitalStats[];
  className?: string;
  isLoading?: boolean;
}

const VitalIndicator = ({
  icon: Icon,
  label,
  value,
  unit,
  color = 'text-gray-500',
}: {
  icon: any;
  label: string;
  value: number | string;
  unit: string;
  color?: string;
}) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
    <div className={cn('p-2 rounded-full bg-white dark:bg-gray-800', color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="flex items-baseline space-x-2">
        <span className="text-xl font-semibold text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const VitalSkeleton = () => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse">
    <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
      <div className="w-5 h-5" />
    </div>
    <div className="space-y-2">
      <div className="flex items-baseline space-x-2">
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

export const VitalsCard = ({
  vitals,
  history = [],
  className,
  isLoading = false,
}: VitalsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading || !vitals) {
    return (
      <div
        className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}
      >
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VitalSkeleton />
          <VitalSkeleton />
          <VitalSkeleton />
          <VitalSkeleton />
        </div>
      </div>
    );
  }

  const getHeartRateColor = (rate: number) => {
    if (rate < 60) return 'text-blue-500';
    if (rate > 100) return 'text-red-500';
    return 'text-green-500';
  };

  const getBloodPressureColor = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return 'text-red-500';
    if (systolic <= 90 || diastolic <= 60) return 'text-blue-500';
    return 'text-green-500';
  };

  const getOxygenColor = (level: number) => {
    if (level < 95) return 'text-red-500';
    if (level < 97) return 'text-yellow-500';
    return 'text-green-500';
  };

  const heartRate = vitals.heartRate ?? '--';
  const bloodPressure = vitals.bloodPressure
    ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`
    : '--/--';
  const oxygenSaturation = vitals.oxygenSaturation ?? '--';
  const bodyTemperature = vitals.bodyTemperature ? vitals.bodyTemperature.toFixed(1) : '--';

  return (
    <div className={cn('bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vital Bulgular</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                   dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VitalIndicator
          icon={Heart}
          label="Nabız"
          value={heartRate}
          unit="bpm"
          color={typeof heartRate === 'number' ? getHeartRateColor(heartRate) : undefined}
        />
        <VitalIndicator
          icon={Activity}
          label="Tansiyon"
          value={bloodPressure}
          unit="mmHg"
          color={
            vitals.bloodPressure
              ? getBloodPressureColor(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic)
              : undefined
          }
        />
        <VitalIndicator
          icon={Wind}
          label="Oksijen"
          value={oxygenSaturation}
          unit="%"
          color={
            typeof oxygenSaturation === 'number' ? getOxygenColor(oxygenSaturation) : undefined
          }
        />
        <VitalIndicator
          icon={Thermometer}
          label="Vücut Isısı"
          value={bodyTemperature}
          unit="°C"
          color={
            typeof vitals.bodyTemperature === 'number' && vitals.bodyTemperature > 37.5
              ? 'text-red-500'
              : 'text-green-500'
          }
        />
      </div>

      {isExpanded && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <VitalsHistoryView history={history} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};
