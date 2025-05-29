'use client';

import { LabResultCard } from './LabResultCard';

const mockData = [
  {
    id: 1,
    name: 'Vitamin D',
    value: 15,
    unit: 'ng/mL',
    referenceRange: '30-100',
    status: 'low' as const,
    date: '2024-03-28',
    trend: [
      { date: '2023-09-28', value: 12 },
      { date: '2023-12-28', value: 14 },
      { date: '2024-03-28', value: 15 },
    ],
  },
  {
    id: 2,
    name: 'Ferritin',
    value: 85,
    unit: 'ng/mL',
    referenceRange: '20-200',
    status: 'normal' as const,
    date: '2024-03-28',
    trend: [
      { date: '2023-09-28', value: 75 },
      { date: '2023-12-28', value: 80 },
      { date: '2024-03-28', value: 85 },
    ],
  },
];

export function LabResultsList() {
  return (
    <div className="space-y-6">
      {mockData.map((result) => (
        <LabResultCard key={result.id} {...result} />
      ))}
    </div>
  );
}
