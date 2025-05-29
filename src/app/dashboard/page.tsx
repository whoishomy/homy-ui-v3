'use client';

import { HealthScoreTrendChart } from '@/components/analytics/charts/HealthScoreTrendChart';
import { DailyWeeklyTabs } from '@/components/analytics/DailyWeeklyTabs';
import { CategoryDistributionChart } from '@/components/analytics/charts/CategoryDistributionChart';
import { useState } from 'react';
import InsightOverlay from '@/components/insights/InsightOverlay';
import React from 'react';
import { NotionPanel } from '@/components/notion/NotionPanel';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Health Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your daily health metrics
          </p>
        </div>

        <div className="mb-6">
          <DailyWeeklyTabs value={viewMode} onValueChange={setViewMode} />
        </div>

        <div className="grid gap-4">
          <HealthScoreTrendChart viewMode={viewMode} />
          <CategoryDistributionChart />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">AI İçgörüleri</h2>
          <InsightOverlay />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <NotionPanel />
          </div>
          <div className="col-span-1 md:col-span-2">
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </main>
  );
}
