import React, { Suspense } from 'react';
import { useTelemetryFeed } from '@/hooks/useTelemetryFeed';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load panels for better initial load performance
const ProviderStatusPanel = React.lazy(() => import('./panels/ProviderStatusPanel'));
const ErrorTimelineChart = React.lazy(() => import('./charts/ErrorTimelineChart'));
const InsightUsageChart = React.lazy(() => import('./charts/InsightUsageChart'));
const FallbackRateChart = React.lazy(() => import('./charts/FallbackRateChart'));

interface TelemetryDashboardProps {
  className?: string;
  refreshInterval?: number;
}

function LoadingPanel() {
  return (
    <div
      role="status"
      data-testid="loading-panel"
      aria-label="Panel yükleniyor"
      className="animate-pulse bg-gray-100 rounded-lg p-6"
    >
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

export function TelemetryDashboard({ className = '', refreshInterval = 5000 }: TelemetryDashboardProps) {
  const { snapshot, error, isLoading } = useTelemetryFeed({
    refreshInterval,
  });

  if (error) {
    return (
      <div 
        role="alert"
        className="bg-red-50 rounded-lg p-4"
      >
        <p className="text-red-800">
          Telemetri verisi alınamadı: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <header role="banner" className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Telemetri Kontrol Paneli
        </h2>
        {isLoading && (
          <span className="text-sm text-gray-500" aria-live="polite">
            Veriler güncelleniyor...
          </span>
        )}
      </header>

      <main role="main" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <LoadingPanel />
            <LoadingPanel />
            <LoadingPanel />
            <LoadingPanel />
          </>
        ) : (
          <>
            <ErrorBoundary>
              <Suspense fallback={<LoadingPanel />}>
                <ProviderStatusPanel
                  providers={snapshot?.providers}
                  className="col-span-2"
                />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingPanel />}>
                <ErrorTimelineChart
                  data={snapshot?.errorTimeline}
                  className="h-96"
                />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingPanel />}>
                <InsightUsageChart
                  data={snapshot?.insights}
                  className="h-96"
                />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingPanel />}>
                <FallbackRateChart
                  data={snapshot?.providers}
                  className="h-96"
                />
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </main>
    </div>
  );
} 