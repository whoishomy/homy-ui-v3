import { render } from '@testing-library/react';
import { LabResultPDFTemplate } from '../LabResultPDFTemplate';
import { mockLabResult, mockFilters } from '@/test/utils';
import { AIGeneratedInsight } from '@/types/health-report';

// Mock react-pdf components
jest.mock('@react-pdf/renderer', () => ({
  Document: 'Document',
  Page: 'Page',
  Text: 'Text',
  View: 'View',
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Font: {
    register: jest.fn(),
  },
  Image: 'Image',
}));

describe('LabResultPDFTemplate', () => {
  it('should render basic template with minimal props', () => {
    const { container } = render(<LabResultPDFTemplate result={mockLabResult} />);
    expect(container).toMatchSnapshot();
  });

  it('should render template with patient info', () => {
    const patientInfo = {
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      id: 'P12345',
    };

    const { container } = render(
      <LabResultPDFTemplate result={mockLabResult} patientInfo={patientInfo} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render template with filters', () => {
    const { container } = render(
      <LabResultPDFTemplate result={mockLabResult} filters={mockFilters} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render template with all props', () => {
    const patientInfo = {
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      id: 'P12345',
    };

    const { container } = render(
      <LabResultPDFTemplate
        result={mockLabResult}
        patientInfo={patientInfo}
        filters={mockFilters}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render insights when available', () => {
    const resultWithInsights = {
      ...mockLabResult,
      insights: [
        {
          type: 'summary' as AIGeneratedInsight['type'],
          content: 'Test insight',
          confidence: 0.95,
          sourceData: ['test'],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const { container } = render(<LabResultPDFTemplate result={resultWithInsights} />);
    expect(container).toMatchSnapshot();
  });

  it('should render notes when available', () => {
    const resultWithNotes = {
      ...mockLabResult,
      notes: 'Test notes',
    };

    const { container } = render(<LabResultPDFTemplate result={resultWithNotes} />);
    expect(container).toMatchSnapshot();
  });

  it('should render filter summary correctly', () => {
    const filters = {
      testType: 'Glucose',
      dateRange: '2024-03-20',
      trend: 'increasing' as const,
      significance: 'abnormal' as const,
    };

    const { container } = render(<LabResultPDFTemplate result={mockLabResult} filters={filters} />);
    expect(container).toMatchSnapshot();
  });
});
