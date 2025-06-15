import React from 'react';
import { render, screen } from '@testing-library/react';
import { LabResultCard } from '@/components/lab/LabResultCard';

const mockProps = {
  title: 'Hemoglobin',
  description: 'Kan hücrelerindeki oksijen taşıyıcı protein',
  value: 14.5,
  unit: 'g/dL',
  min: 12,
  max: 16,
  data: [
    { value: 14.2, date: '2024-01-01' },
    { value: 14.5, date: '2024-02-01' },
    { value: 14.8, date: '2024-03-01' },
  ],
};

describe('LabResultCard', () => {
  it('renders test name, result, reference range, and date correctly', () => {
    render(<LabResultCard {...mockProps} />);

    expect(screen.getByText('Hemoglobin')).toBeInTheDocument();
    expect(screen.getByText('Kan hücrelerindeki oksijen taşıyıcı protein')).toBeInTheDocument();
    expect(screen.getByText('14.5')).toBeInTheDocument();
    expect(screen.getByText('g/dL')).toBeInTheDocument();
    expect(screen.getByText('Referans Aralığı: 12 - 16 g/dL')).toBeInTheDocument();
  });

  it('shows AlertCircle if result is out of range', () => {
    render(<LabResultCard {...mockProps} value={17} />);
    expect(screen.getByLabelText('Değer aralık dışında')).toBeInTheDocument();
  });

  it('shows CheckCircle if result is within range', () => {
    render(<LabResultCard {...mockProps} />);
    expect(screen.getByLabelText('Değer normal aralıkta')).toBeInTheDocument();
  });

  it('displays insight comment if provided', () => {
    const insight = 'Değerler normal aralıkta seyrediyor.';
    render(<LabResultCard {...mockProps} insight={insight} />);
    expect(screen.getByText(insight)).toBeInTheDocument();
  });

  it('does not display insight comment if not provided', () => {
    render(<LabResultCard {...mockProps} />);
    const insightElements = screen.queryAllByText(/değerler/i);
    expect(insightElements).toHaveLength(0);
  });

  it('is accessible with proper ARIA attributes', () => {
    render(<LabResultCard {...mockProps} />);
    expect(screen.getByRole('heading', { name: 'Hemoglobin' })).toBeInTheDocument();
    expect(screen.getByLabelText('Değer normal aralıkta')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(<LabResultCard {...mockProps} isLoading />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
