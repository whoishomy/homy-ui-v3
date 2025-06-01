import { Suspense } from 'react';
import { LabResultCard } from '@/components/lab/LabResultCard';
import { InsightOverlay } from '@/components/insight/InsightOverlay';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { LabResult } from '@/types/lab-results';
import { ResultDetailDrawer } from '@/components/dashboard/ResultDetailDrawer';

// This remains a Server Component
export default function Home() {
  const labResult: LabResult = {
    id: '1',
    testName: 'Complete Blood Count',
    title: 'Tam Kan Sayımı',
    category: 'blood',
    status: 'normal',
    value: 14.2,
    unit: 'g/dL',
    referenceRange: {
      min: 12.0,
      max: 15.5,
      unit: 'g/dL',
    },
    timestamp: new Date().toISOString(),
    orderedBy: 'Dr. Mehmet Öz',
    performedBy: 'Merkez Laboratuvarı',
    specimenType: 'Kan',
    collectionDate: new Date().toISOString(),
    reportDate: new Date().toISOString(),
    notes: 'Normal sınırlar içinde',
    data: [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün önce
        value: 13.8,
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 gün önce
        value: 14.0,
      },
      {
        date: new Date().toISOString(), // şimdi
        value: 14.2,
      },
    ],
    trend: 'stable',
    clinicalContext: {
      significance: 'Normal',
      relatedTests: ['Demir', 'Ferritin', 'B12 Vitamini'],
      doctorNotes: 'Hemoglobin değerleri normal sınırlar içinde seyrediyor.',
    },
    recommendations: ['Rutin kontrollere devam', 'Dengeli beslenme', 'Düzenli egzersiz'],
    insights: [
      {
        type: 'observation',
        content: 'Hemoglobin değerlerinde stabil seyir',
        message: 'Son 30 günde hemoglobin değerlerinde anlamlı değişiklik gözlenmedi',
        confidence: 0.92,
        source: 'AI Analiz Sistemi',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">🧪 HOMY Insight Panel</h1>
            <p className="text-sm text-foreground/60 mt-1">
              AI-powered health analytics and insights
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lab Results Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">Lab Results</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <LabResultCard result={labResult} />
            </Suspense>
          </section>

          {/* Insights Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">AI Insights</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <InsightOverlay />
            </Suspense>
          </section>
        </div>

        <ResultDetailDrawer result={labResult} isOpen={true} onClose={() => {}} />
      </div>
    </main>
  );
}
