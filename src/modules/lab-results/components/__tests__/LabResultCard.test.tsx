import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LabResultCard } from '../LabResultCard';
import { LabResult } from '../../types/lab-result';

describe('LabResultCard', () => {
  const mockOutOfRangeResult: LabResult = {
    id: '1',
    testName: 'Vitamin D',
    result: 18,
    referenceRange: [30, 100],
    unit: 'ng/mL',
    date: '2025-05-28',
    insightComment: 'Low vitamin D may affect mood and immunity.',
  };

  const mockNormalResult: LabResult = {
    id: '2',
    testName: 'Hemoglobin',
    result: 14,
    referenceRange: [12, 16],
    unit: 'g/dL',
    date: '2025-05-28',
  };

  it('renders test name, result, reference range, and date correctly', () => {
    render(<LabResultCard data={mockOutOfRangeResult} />);

    expect(screen.getByText('Vitamin D')).toBeInTheDocument();
    expect(screen.getByText(/18 ng\/mL/)).toBeInTheDocument();
    expect(screen.getByText(/30 – 100 ng\/mL/)).toBeInTheDocument();
    expect(screen.getByText(/May 28, 2025/)).toBeInTheDocument();
  });

  it('shows AlertCircle if result is out of range', () => {
    render(<LabResultCard data={mockOutOfRangeResult} />);

    const alertIcon = screen.getByTestId('alert-circle');
    expect(alertIcon).toBeInTheDocument();
    expect(alertIcon).toHaveClass('text-red-600');
  });

  it('shows CheckCircle if result is within range', () => {
    render(<LabResultCard data={mockNormalResult} />);

    const checkIcon = screen.getByTestId('check-circle');
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass('text-green-600');
  });

  it('displays insight comment if provided', () => {
    render(<LabResultCard data={mockOutOfRangeResult} />);

    expect(screen.getByText(/Low vitamin D may affect mood and immunity/)).toBeInTheDocument();
  });

  it('does not display insight comment if not provided', () => {
    render(<LabResultCard data={mockNormalResult} />);

    const insightComments = screen.queryByText(/💡/);
    expect(insightComments).not.toBeInTheDocument();
  });

  it('is accessible with proper ARIA attributes', () => {
    render(<LabResultCard data={mockOutOfRangeResult} />);

    const card = screen.getByRole('region');
    expect(card).toHaveAttribute('aria-label', 'Lab result for Vitamin D');
  });
});
