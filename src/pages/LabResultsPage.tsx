import React from 'react';
import { useTayfun } from '@/contexts/TayfunContext';
import { LabResultCard } from '@/components/analytics/components/LabResultCard';

export default function LabResultsPage() {
  const { labResults } = useTayfun();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Laboratuvar Sonuçları</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labResults.map((result) => (
          <LabResultCard key={result.test} result={result} />
        ))}
      </div>
    </div>
  );
}
