'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabResultCard } from '@/components/lab/LabResultCard';
import { ResultFilterBar } from '@/components/dashboard/ResultFilterBar';
import { LabResultDetailView } from '@/components/lab/LabResultDetailView';
import { cn } from '@/utils/cn';
import { useTrademarkStyle } from '../../hooks/useTrademarkStyle';
import { getTrademarkName } from '../../utils/trademark';
import { enhanceLabResult } from '../../utils/labResultUpgrade';
import { LabResult, LabResultHistory, LabResultTrend } from '@/types/lab-results';

export type ClinicalSignificance =
  | 'Critical - Immediate attention required'
  | 'Significant - Clinical review recommended'
  | 'Abnormal - Monitor closely'
  | 'Normal - Continue routine monitoring';

interface Filters {
  testType: string;
  dateRange: string;
  trend: LabResultTrend | undefined;
  significance?: 'critical' | 'significant' | 'abnormal' | 'normal';
}

interface Props {
  results: LabResult[];
  className?: string;
}

export const LabResultsPanel = ({ results, className }: Props) => {
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [filters, setFilters] = useState<Filters>({
    testType: '',
    dateRange: '',
    trend: undefined,
    significance: undefined,
  });

  const containerRef = useTrademarkStyle<HTMLDivElement>();

  const enhancedResults = useMemo(() => {
    return results.map((result) => enhanceLabResult(result));
  }, [results]);

  const filteredResults = useMemo(() => {
    return enhancedResults.filter((result) => {
      // Test type filter
      if (
        filters.testType &&
        !result.testName.toLowerCase().includes(filters.testType.toLowerCase())
      ) {
        return false;
      }

      // Trend filter
      if (filters.trend && result.trend !== filters.trend) {
        return false;
      }

      // Clinical significance filter
      if (filters.significance && result.clinicalContext?.significance) {
        const significanceMap = {
          critical: 'Critical - Immediate attention required',
          significant: 'Significant - Clinical review recommended',
          abnormal: 'Abnormal - Monitor closely',
          normal: 'Normal - Continue routine monitoring',
        } as const;
        if (result.clinicalContext.significance !== significanceMap[filters.significance]) {
          return false;
        }
      }

      return true;
    });
  }, [enhancedResults, filters]);

  const resultStats = useMemo(() => {
    return {
      total: results.length,
      critical: enhancedResults.filter(
        (r) => r.clinicalContext?.significance === 'Critical - Immediate attention required'
      ).length,
      abnormal: enhancedResults.filter(
        (r) =>
          r.clinicalContext?.significance?.includes('Abnormal') ||
          r.clinicalContext?.significance?.includes('Significant')
      ).length,
    };
  }, [enhancedResults, results.length]);

  return (
    <motion.section
      ref={containerRef}
      className={cn('space-y-6', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {getTrademarkName('Lab Results')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Critical: {resultStats.critical}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Abnormal: {resultStats.abnormal}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total: {resultStats.total}
            </span>
          </div>
        </div>
      </div>

      <ResultFilterBar onFilterChangeAction={setFilters} className="mb-4" showSignificanceFilter />

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        layout
        initial={false}
      >
        <AnimatePresence>
          {filteredResults.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LabResultCard result={result} onClick={() => setSelectedResult(result)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <LabResultDetailView
        result={selectedResult}
        isOpen={!!selectedResult}
        onCloseAction={() => setSelectedResult(null)}
      />
    </motion.section>
  );
};
