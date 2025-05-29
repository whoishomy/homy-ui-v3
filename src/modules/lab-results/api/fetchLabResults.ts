import { LabResult } from '@/types/lab-results';
import { generateMockHealthReport } from '@/modules/export/health-report/utils/mockReportData';

const MOCK_LAB_RESULTS: LabResult[] = [
  {
    id: 'vit-d-001',
    testName: 'Vitamin D',
    result: 18,
    referenceRange: [30, 100],
    unit: 'ng/mL',
    date: '2025-05-28',
    insightComment: 'Low vitamin D may affect mood and immunity.',
    trendData: [
      { date: '2025-01-28', value: 15 },
      { date: '2025-02-28', value: 16 },
      { date: '2025-03-28', value: 14 },
      { date: '2025-04-28', value: 17 },
      { date: '2025-05-28', value: 18 },
    ],
  },
  {
    id: 'hgb-001',
    testName: 'Hemoglobin',
    result: 14.2,
    referenceRange: [13.5, 17.5],
    unit: 'g/dL',
    date: '2025-05-20',
    trendData: [
      { date: '2025-01-20', value: 13.8 },
      { date: '2025-02-20', value: 14.0 },
      { date: '2025-03-20', value: 14.1 },
      { date: '2025-04-20', value: 14.3 },
      { date: '2025-05-20', value: 14.2 },
    ],
  },
  {
    id: 'tsh-001',
    testName: 'TSH',
    result: 4.8,
    referenceRange: [0.4, 4.0],
    unit: 'mIU/L',
    date: '2024-03-28',
    insightComment: 'Mild elevation may suggest subclinical hypothyroidism.',
    trendData: [
      { date: '2023-09-28', value: 2.5 },
      { date: '2023-12-28', value: 3.6 },
      { date: '2024-03-28', value: 4.8 },
    ],
  },
  {
    id: 'fer-001',
    testName: 'Ferritin',
    result: 85,
    referenceRange: [20, 200],
    unit: 'ng/mL',
    date: '2025-05-28',
    trendData: [
      { date: '2025-01-28', value: 90 },
      { date: '2025-02-28', value: 88 },
      { date: '2025-03-28', value: 87 },
      { date: '2025-04-28', value: 86 },
      { date: '2025-05-28', value: 85 },
    ],
  },
];

/**
 * Fetches lab results from the mock API
 * @returns Promise<LabResult[]> A promise that resolves to an array of lab results
 */
export async function fetchLabResults(): Promise<LabResult[]> {
  // For demo purposes, we'll use mock data
  const mockReport = generateMockHealthReport();
  return mockReport.labResults.recent;
}

/**
 * Fetches a single lab result by ID
 * @param id The ID of the lab result to fetch
 * @returns Promise<LabResult | undefined> A promise that resolves to a lab result or undefined if not found
 */
export const fetchLabResultById = async (id: string): Promise<LabResult | undefined> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return Promise.resolve(MOCK_LAB_RESULTS.find((result) => result.id === id));
};
