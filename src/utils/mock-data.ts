import type { LabResult } from '@/types/lab-results';

interface MockHealthReport {
  labResults: {
    recent: LabResult[];
  };
}

export function generateMockHealthReport(): MockHealthReport {
  const mockLabResults: LabResult[] = [
    {
      id: crypto.randomUUID(),
      testName: 'Complete Blood Count',
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
      orderedBy: 'Dr. Smith',
      performedBy: 'Central Lab',
      specimenType: 'Whole Blood',
      collectionDate: new Date().toISOString(),
      reportDate: new Date().toISOString(),
      notes: 'Within normal range',
    },
    {
      id: crypto.randomUUID(),
      testName: 'Blood Glucose',
      category: 'blood',
      status: 'high',
      value: 140,
      unit: 'mg/dL',
      referenceRange: {
        min: 70,
        max: 100,
        unit: 'mg/dL',
      },
      timestamp: new Date().toISOString(),
      orderedBy: 'Dr. Johnson',
      performedBy: 'Central Lab',
      specimenType: 'Plasma',
      collectionDate: new Date().toISOString(),
      reportDate: new Date().toISOString(),
      notes: 'Above normal range',
    },
  ];

  return {
    labResults: {
      recent: mockLabResults,
    },
  };
}
