export interface LabResult {
  test: string;
  value: number;
  unit: string;
  date: string;
  referenceRange: {
    min: number;
    max: number;
  };
  isAbnormal: boolean;
}

export const tayfunLabResults: LabResult[] = [
  {
    test: 'Glukoz',
    value: 190,
    unit: 'mg/dL',
    date: '2025-06-10',
    referenceRange: {
      min: 70,
      max: 100,
    },
    isAbnormal: true,
  },
  {
    test: 'Kreatinin',
    value: 2.1,
    unit: 'mg/dL',
    date: '2025-06-10',
    referenceRange: {
      min: 0.7,
      max: 1.3,
    },
    isAbnormal: true,
  },
  {
    test: 'HbA1c',
    value: 8.4,
    unit: '%',
    date: '2025-06-10',
    referenceRange: {
      min: 4.0,
      max: 5.7,
    },
    isAbnormal: true,
  },
];
