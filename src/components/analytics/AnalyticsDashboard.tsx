'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { useAnalyticsStore } from '@/store';
import { AnalyticsFilters, HealthCategory, TimeRange } from '@/types/analytics';
import { HealthScoreTrendChart } from '@/components/analytics/charts/HealthScoreTrendChart';
import { HealthTrendCards } from '@/components/analytics/components/HealthTrendCards';
import { GoalCompletionRadar } from '@/components/analytics/components/GoalCompletionRadar';
import { MonthlyAdherenceCalendar } from '@/components/analytics/components/MonthlyAdherenceCalendar';
import { InsightsSummary } from '@/components/analytics/components/InsightsSummary';
import { TimeRangeSelector } from '@/components/analytics/components/TimeRangeSelector';
import { CategoryFilter } from '@/components/analytics/components/CategoryFilter';
import { CategoryDistributionChart } from './CategoryDistributionChart';
import { DailyWeeklyTabs } from './DailyWeeklyTabs';

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const [filters, setFilters] = useState<AnalyticsFilters>(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7); // Default to last 7 days for weekly view

    return {
      timeRange: 'weekly',
      startDate,
      endDate: now,
      categories: Object.keys(HealthCategory) as Array<keyof typeof HealthCategory>,
      onlyActive: true,
    };
  });

  const { summary, insights, loading, error, fetchSummary, fetchInsights } = useAnalyticsStore();

  useEffect(() => {
    fetchSummary(filters);
    fetchInsights(filters);
  }, [filters, fetchSummary, fetchInsights]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setFilters((prev) => {
      const now = new Date();
      const startDate = new Date(now);

      switch (range) {
        case 'daily':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      return {
        ...prev,
        timeRange: range,
        startDate,
        endDate: now,
      };
    });
  };

  const handleCategoryFilter = (categories: Array<keyof typeof HealthCategory>) => {
    setFilters((prev) => ({ ...prev, categories }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Veri yüklenirken bir hata oluştu</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

        {/* Daily/Weekly Tabs */}
        <DailyWeeklyTabs />

        {/* Health Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Daily Health Score</h2>
          <div className="text-3xl font-bold text-green-600">87%</div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryDistributionChart />
          <HealthScoreTrendChart />
        </div>
      </div>
    </motion.div>
  );
};

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
