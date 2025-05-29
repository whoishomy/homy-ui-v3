'use client';

import { useEffect, useState } from 'react';
import { LabResult } from '@/types/lab-results';
import { fetchLabResults } from '../api/fetchLabResults';
import { LabResultsPanel } from '@/components/dashboard/LabResultsPanel';
import { Loader2 } from 'lucide-react';

export const LabResultsList = () => {
  const [results, setResults] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLabResults();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lab results'));
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-[200px] flex items-center justify-center"
        role="status"
        aria-label="Loading lab results"
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
        <h3 className="text-lg font-semibold text-red-800">Unable to load lab results</h3>
        <p className="mt-2 text-sm text-red-700">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
        >
          Try again
        </button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center" role="status">
        <h3 className="text-lg font-semibold text-gray-900">No lab results found</h3>
        <p className="mt-2 text-sm text-gray-600">
          There are no lab results available at this time.
        </p>
      </div>
    );
  }

  return <LabResultsPanel results={results} />;
};
