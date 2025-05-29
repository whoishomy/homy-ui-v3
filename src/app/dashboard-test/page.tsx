'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CarePlanSummaryCard } from '@/components/dashboard/CarePlanSummaryCard';
import { VitalsCard } from '@/components/dashboard/VitalsCard';
import { LabResultCard } from '@/components/lab/LabResultCard';
import { generateMockHealthReport } from '@/modules/export/health-report/utils/mockReportData';
import { CarePlan } from '@/types/carePlan';
import { VitalStats } from '@/types/health-report';
import { LabResult, LabResultHistory } from '@/types/lab-results';

export default function DashboardTestPage() {
  const [mockPlan, setMockPlan] = useState<CarePlan>(() => ({
    id: crypto.randomUUID(),
    patientId: crypto.randomUUID(),
    title: 'Genel Sağlık İyileştirme Planı',
    description: 'Hastanın genel sağlık durumunu iyileştirmeye yönelik kapsamlı plan.',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    medications: [],
    appointments: [],
    goals: [],
    metrics: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const [mockVitals, setMockVitals] = useState(() => generateMockHealthReport().vitals.current);
  const [mockVitalsHistory, setMockVitalsHistory] = useState<VitalStats[]>(
    () => generateMockHealthReport().vitals.history
  );
  const [mockLabResults, setMockLabResults] = useState<LabResult[]>(
    () => generateMockHealthReport().labResults.recent
  );
  const [mockLabHistory, setMockLabHistory] = useState<LabResultHistory>(() => ({
    testId: crypto.randomUUID(),
    history: generateMockHealthReport().labResults.recent,
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalCount: 5,
      averageValue: 95,
      standardDeviation: 2.1,
    },
  }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = () => {
    console.log('View details clicked for plan:', mockPlan.id);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newReport = generateMockHealthReport();
      setMockPlan({
        ...mockPlan,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      });
      setMockVitals(newReport.vitals.current);
      setMockVitalsHistory(newReport.vitals.history);
      setMockLabResults(newReport.labResults.recent);
      setMockLabHistory({
        ...mockLabHistory,
        history: newReport.labResults.recent,
        metadata: {
          ...mockLabHistory.metadata,
          lastUpdated: new Date().toISOString(),
        },
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="col-span-full lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Test</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg 
                     hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-green-500 transition-colors"
          >
            Yenile
          </button>
        </div>

        <div className="space-y-6">
          {/* Vitals Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Vital Bulgular Kartı
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <VitalsCard isLoading />
              <VitalsCard vitals={mockVitals} history={mockVitalsHistory} isLoading={isLoading} />
            </div>
          </div>

          {/* Lab Results Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Laboratuvar Sonuçları
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabResultCard isLoading />
              {mockLabResults.map((result) => (
                <LabResultCard
                  key={result.id}
                  result={result}
                  history={mockLabHistory}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>

          {/* CarePlan Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Bakım Planı Kartları
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Loading State */}
              <CarePlanSummaryCard isLoading />

              {/* Active Plan */}
              <CarePlanSummaryCard
                plan={{
                  ...mockPlan,
                  status: 'active',
                  title: 'Aktif Tedavi Planı',
                }}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />

              {/* Completed Plan */}
              <CarePlanSummaryCard
                plan={{
                  ...mockPlan,
                  status: 'completed',
                  title: 'Tamamlanan Plan',
                }}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />

              {/* Paused Plan */}
              <CarePlanSummaryCard
                plan={{
                  ...mockPlan,
                  status: 'paused',
                  title: 'Duraklatılan Plan',
                }}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />

              {/* Draft Plan */}
              <CarePlanSummaryCard
                plan={{
                  ...mockPlan,
                  status: 'draft',
                  title: 'Taslak Plan',
                }}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
