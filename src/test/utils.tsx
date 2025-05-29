import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { FilterProvider } from '@/contexts/FilterContext';
import { Filters } from '@/contexts/FilterContext';
import { LabResult } from '@/types/lab-results';

// Test wrapper with providers
const AllTheProviders = ({
  children,
  initialFilters,
}: {
  children: React.ReactNode;
  initialFilters?: Filters;
}) => {
  return <FilterProvider initialFilters={initialFilters}>{children}</FilterProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialFilters?: Filters }
) => {
  const { initialFilters, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => AllTheProviders({ ...props, initialFilters }),
    ...renderOptions,
  });
};

// Mock data
export const mockLabResult: LabResult = {
  id: 'test-uuid',
  testName: 'Hemoglobin',
  category: 'blood',
  date: '2024-03-20T10:00:00.000Z',
  value: 14.5,
  unit: 'g/dL',
  referenceRange: {
    min: 12,
    max: 16,
    unit: 'g/dL',
    ageSpecific: true,
    genderSpecific: true,
  },
  status: 'normal',
  trend: 'stable',
  laboratory: 'Central Lab',
  methodology: {
    name: 'Spektrofotometri',
    device: 'Roche Cobas 8000',
    sampleType: 'Serum',
    processingTime: '45 dakika',
    description: 'Hemoglobin ölçümü için spektrofotometrik analiz yöntemi',
    limitations: [
      'Hemoliz varlığında sonuçlar etkilenebilir',
      'Lipemik numunelerde interferans olabilir',
      'Yüksek bilirubin düzeyleri ölçümü etkileyebilir',
    ],
  },
  orderedBy: 'Dr. Mehmet Yılmaz',
  reportedBy: 'Lab. Uzm. Ayşe Demir',
  notes: 'Normal referans aralığında',
  sampleCollectedAt: '2024-03-20T08:00:00.000Z',
  sampleProcessedAt: '2024-03-20T09:00:00.000Z',
  resultAvailableAt: '2024-03-20T10:00:00.000Z',
  verifiedAt: '2024-03-20T10:15:00.000Z',
  verifiedBy: 'Lab. Uzm. Ayşe Demir',
  insights: [
    {
      type: 'summary',
      content: 'Hemoglobin değeri normal aralıkta ve stabil seyrediyor.',
      confidence: 0.95,
      sourceData: ['vitals', 'lab-history'],
      timestamp: '2024-03-20T10:00:00.000Z',
    },
  ],
};

export const mockFilters: Filters = {
  testType: 'Hemoglobin',
  dateRange: '2024-03-20',
  trend: 'stable',
  significance: 'normal',
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
