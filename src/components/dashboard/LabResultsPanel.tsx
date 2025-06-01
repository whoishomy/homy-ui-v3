import type { LabResult } from '@/types/lab-results';

interface LabResultsPanelProps {
  results: LabResult[];
  onResultClick?: (result: LabResult) => void;
  isLoading?: boolean;
  error?: Error;
}

export function LabResultsPanel({
  results,
  onResultClick,
  isLoading,
  error,
}: LabResultsPanelProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {results.map((result) => (
        <div key={result.id} onClick={() => onResultClick?.(result)}>
          <h3>{result.testName}</h3>
          <p>
            {result.value} {result.unit}
          </p>
          <p>Status: {result.status}</p>
        </div>
      ))}
    </div>
  );
}
