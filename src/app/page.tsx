import { Suspense } from 'react';
import { LabResultCard } from '@/components/lab/LabResultCard';
import { InsightOverlay } from '@/components/insight/InsightOverlay';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// This remains a Server Component
export default function Home() {
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
              <LabResultCard
                title="Complete Blood Count"
                description="Key indicators of blood health and immune system function"
                unit="g/dL"
                data={[
                  { date: '2024-01-01', value: 14.2 },
                  { date: '2024-02-01', value: 14.5 },
                  { date: '2024-03-01', value: 14.3 },
                ]}
                referenceRange={{ min: 12, max: 16 }}
              />
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
      </div>
    </main>
  );
}
