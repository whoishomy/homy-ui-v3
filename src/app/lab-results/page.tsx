'use client';

import { LabResultsList } from '@/modules/lab-results/components/LabResultsList';

export default function LabResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lab Results</h1>
        <p className="mt-2 text-lg text-gray-600">
          View and track your latest laboratory test results
        </p>
      </div>

      <LabResultsList />
    </div>
  );
}
