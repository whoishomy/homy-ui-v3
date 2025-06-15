import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTrendChart } from '@/components/charts/DataTrendChart';

const mockData = [
  { date: '2024-01-01', value: 10 },
  { date: '2024-01-02', value: 20 },
  { date: '2024-01-03', value: 15 },
];

const defaultProps = {
  title: 'Test Chart',
  data: mockData,
  valueUnit: 'units',
  valueLabel: 'Test Value',
};

describe('DataTrendChart', () => {
  it('renders chart with data', () => {
    render(<DataTrendChart {...defaultProps} />);
    expect(screen.getByRole('img', { name: /trend chart/i })).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(<DataTrendChart {...defaultProps} />);
    const chart = screen.getByRole('img', { name: /trend chart/i });
    await userEvent.hover(chart);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<DataTrendChart {...defaultProps} data={[]} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('displays reference range when provided', () => {
    const propsWithRange = {
      ...defaultProps,
      referenceRange: {
        min: 5,
        max: 25,
      },
    };
    render(<DataTrendChart {...propsWithRange} />);
    expect(screen.getByRole('img', { name: /trend chart/i })).toBeInTheDocument();
  });
});
