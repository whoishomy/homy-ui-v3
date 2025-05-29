import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LabResultDetailView, LabResultDetailViewProps } from '../LabResultDetailView';
import { FilterProvider } from '@/contexts/FilterContext';
import { generateMockHealthReport } from '@/modules/export/health-report/utils/mockReportData';
import { downloadLabResultPDF } from '@/modules/export/lab-report/utils/generateLabResultPDF';
import { LabResult, LabResultHistory } from '@/types/lab-results';
import { mockFormat } from '@/test/mocks/dateMock';
import '../../../test/mocks/resizeObserverMock';

// Mock the PDF download function
jest.mock('@/modules/export/lab-report/utils/generateLabResultPDF', () => ({
  downloadLabResultPDF: jest.fn(),
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest
    .fn()
    .mockImplementation((date, format, options) => mockFormat(date, format, options)),
}));

// Mock date-fns/locale
jest.mock('date-fns/locale', () => ({
  tr: {},
}));

// Mock LabResultTrendChart component
jest.mock('../LabResultTrendChart', () => ({
  LabResultTrendChart: ({ data }: { data: Array<{ date: string; value: number }> }) => (
    <div data-testid="trend-chart">
      {data.map((point, index) => (
        <div key={index} data-testid="data-point">
          {point.date}: {point.value}
        </div>
      ))}
    </div>
  ),
}));

describe('LabResultDetailView Integration Tests', () => {
  const mockLabResult: LabResult = {
    id: '1',
    testName: 'Hemoglobin',
    category: 'blood',
    status: 'normal',
    value: 14.5,
    unit: 'g/dL',
    date: '2024-03-15',
    laboratory: 'Central Lab',
    referenceRange: {
      min: 12,
      max: 16,
      unit: 'g/dL',
    },
    methodology: {
      name: 'Spektrofotometri',
      device: 'Sysmex XN-1000',
      sampleType: 'Tam Kan',
      processingTime: '30 dakika',
      description: 'Spektrofotometrik yöntem ile hemoglobin ölçümü',
      limitations: ['Hemoliz durumunda sonuçlar etkilenebilir'],
    },
    orderedBy: 'Dr. Ahmet Yılmaz',
    reportedBy: 'Dr. Mehmet Öz',
    notes: 'Normal sınırlar içinde',
    trend: 'stable',
    insights: [
      {
        type: 'summary',
        content: 'Değerler normal aralıkta',
        confidence: 0.95,
        sourceData: [
          'Hemoglobin değeri 14.5 g/dL',
          'Referans aralığı: 12-16 g/dL',
          'Trend: Stabil',
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const mockHistory: LabResultHistory = {
    testId: mockLabResult.id,
    history: [
      mockLabResult,
      {
        ...mockLabResult,
        value: 14.8,
        date: '2024-03-01',
      },
    ],
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalCount: 2,
      averageValue: 14.65,
      standardDeviation: 0.15,
    },
  };

  const defaultProps: LabResultDetailViewProps = {
    result: mockLabResult,
    history: mockHistory,
    isOpen: true,
    onCloseAction: jest.fn(),
  };

  const renderWithProviders = (props: LabResultDetailViewProps = defaultProps) => {
    return render(
      <FilterProvider>
        <LabResultDetailView {...props} />
      </FilterProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders lab result details correctly', () => {
    renderWithProviders();

    // Test basic information rendering
    expect(screen.getByText(mockLabResult.testName)).toBeInTheDocument();
    expect(screen.getByText(/Central Lab/)).toBeInTheDocument();
    expect(screen.getByText('14.5')).toBeInTheDocument();
    expect(screen.getAllByText('g/dL')).toHaveLength(2); // We expect two instances of the unit

    // Test date formatting
    const formattedDate = mockFormat(new Date(mockLabResult.date), 'PPP');
    expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();
  });

  it('renders trend chart when history is provided', () => {
    renderWithProviders();

    expect(screen.getByText('Trend Analizi')).toBeInTheDocument();
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();

    // Verify data points are rendered
    const dataPoints = screen.getAllByTestId('data-point');
    expect(dataPoints).toHaveLength(mockHistory.history.length);
  });

  it('handles PDF export', async () => {
    renderWithProviders();

    const exportButton = screen.getByRole('button', { name: /pdf indir/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(downloadLabResultPDF).toHaveBeenCalledWith(mockLabResult, {
        filters: expect.any(Object),
      });
    });
  });

  it('handles close action', () => {
    renderWithProviders();

    const closeButton = screen.getByRole('button', { name: /kapat/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onCloseAction).toHaveBeenCalled();
  });

  it('renders nothing when result is not provided', () => {
    const { container } = renderWithProviders({
      ...defaultProps,
      result: undefined,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders insights when available', () => {
    renderWithProviders();

    mockLabResult.insights?.forEach((insight) => {
      expect(screen.getByText(insight.content)).toBeInTheDocument();
    });
  });

  it('renders reference range information', () => {
    renderWithProviders();

    const { min, max } = mockLabResult.referenceRange;
    expect(screen.getByText(`${min}-${max}`)).toBeInTheDocument();
  });

  it('renders test methodology details', () => {
    renderWithProviders();

    if (mockLabResult.methodology) {
      const { methodology } = mockLabResult;
      expect(screen.getByText('Test Metodolojisi')).toBeInTheDocument();
      expect(screen.getByText('Laboratuvar')).toBeInTheDocument();
      expect(screen.getByText('Kategori')).toBeInTheDocument();
    }
  });

  it('handles PDF export errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (downloadLabResultPDF as jest.Mock).mockRejectedValueOnce(new Error('PDF generation failed'));

    renderWithProviders();

    const exportButton = screen.getByRole('button', { name: /pdf indir/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('PDF indirme hatası:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
