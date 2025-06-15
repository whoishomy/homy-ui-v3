import React from 'react';
import { useTayfun } from '@/contexts/TayfunContext';
import { InsightOverlay } from '@/components/analytics/components/InsightOverlay';

export default function DashboardPage() {
  const { insights } = useTayfun();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tayfun Vakası - Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Klinik İçgörüler</h2>
          <InsightOverlay insights={insights} />
        </section>
      </div>
    </div>
  );
}
