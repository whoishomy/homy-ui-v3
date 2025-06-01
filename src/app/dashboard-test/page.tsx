'use client';

import { useState } from 'react';
import { generateMockHealthReport } from '@/utils/mock-data';
import type { LabResult } from '@/types/lab-results';

interface LabResultHistoryWithMetadata {
  testId: string;
  history: LabResult[];
  metadata: {
    lastUpdated: string;
    totalCount: number;
    averageValue: number;
    standardDeviation: number;
  };
}

export default function DashboardTestPage() {
  const [mockLabResults, setMockLabResults] = useState<LabResult[]>(
    () => generateMockHealthReport().labResults.recent
  );
  const [mockLabHistory, setMockLabHistory] = useState<LabResultHistoryWithMetadata>(() => ({
    testId: crypto.randomUUID(),
    history: generateMockHealthReport().labResults.recent,
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalCount: 10,
      averageValue: 120,
      standardDeviation: 5,
    },
  }));

  return (
    <div>
      <h1>Dashboard Test</h1>
      <pre>{JSON.stringify(mockLabResults, null, 2)}</pre>
      <pre>{JSON.stringify(mockLabHistory, null, 2)}</pre>
    </div>
  );
}
