'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/utils/cn';
import { useTrademarkStyle } from '../../hooks/useTrademarkStyle';
import { getTrademarkName } from '../../utils/trademark';
import type { LabResult } from '@/types/lab-results';

type FilterValue = string | undefined;

interface Filters {
  testType: FilterValue;
  dateRange: FilterValue;
  trend: LabResult['trend'];
  significance?: 'critical' | 'significant' | 'abnormal' | 'normal';
}

interface Props {
  onFilterChangeAction: (filters: Filters) => void;
  className?: string;
  showSignificanceFilter?: boolean;
}

export const ResultFilterBar = ({
  onFilterChangeAction,
  className,
  showSignificanceFilter,
}: Props) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();
  const [filters, setFilters] = useState<Filters>({
    testType: '',
    dateRange: '',
    trend: undefined,
    significance: undefined,
  });

  const handleFilterChange = <K extends keyof Filters>(key: K, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value || undefined,
      } as Filters;
      onFilterChangeAction(newFilters);
      return newFilters;
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl', className)}
      role="search"
      aria-label={getTrademarkName('Sonuç Filtreleri')}
    >
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Test Türü
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Test adı ile ara..."
          value={filters.testType || ''}
          onChange={(e) => handleFilterChange('testType', e.target.value)}
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tarih Aralığı
        </label>
        <select
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filters.dateRange || ''}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        >
          <option value="">Tüm zamanlar</option>
          <option value="last-week">Son 1 hafta</option>
          <option value="last-month">Son 1 ay</option>
          <option value="last-3-months">Son 3 ay</option>
          <option value="last-year">Son 1 yıl</option>
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Trend
        </label>
        <select
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filters.trend || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setFilters((prev) => {
                const newFilters = { ...prev, trend: undefined };
                onFilterChangeAction(newFilters);
                return newFilters;
              });
            } else {
              setFilters((prev) => {
                const newFilters = { ...prev, trend: value as LabResult['trend'] };
                onFilterChangeAction(newFilters);
                return newFilters;
              });
            }
          }}
        >
          <option value="">Tüm trendler</option>
          <option value="up">Artış</option>
          <option value="down">Azalış</option>
          <option value="stable">Stabil</option>
        </select>
      </div>

      {showSignificanceFilter && (
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Klinik Önem
          </label>
          <select
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filters.significance || ''}
            onChange={(e) => {
              const value = e.target.value as Filters['significance'];
              handleFilterChange('significance', value === '' ? undefined : value);
            }}
          >
            <option value="">Tüm önemler</option>
            <option value="critical">Kritik</option>
            <option value="significant">Önemli</option>
            <option value="abnormal">Anormal</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      )}
    </div>
  );
};
