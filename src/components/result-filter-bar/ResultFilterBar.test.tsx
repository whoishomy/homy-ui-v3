import { render, screen, fireEvent } from '@testing-library/react';
import { ResultFilterBar } from '../dashboard/ResultFilterBar';

/**
 * ResultFilterBar Component Tests
 *
 * The ResultFilterBar component provides filtering capabilities for lab results,
 * including test type, date range, trend, and significance filters.
 *
 * ## Visual Documentation
 *
 * Screenshots will be automatically updated here by the documentation system.
 */

describe('ResultFilterBar', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter inputs', () => {
    render(<ResultFilterBar onFilterChangeAction={mockOnFilterChange} />);

    expect(screen.getByLabelText(/test türü/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tarih aralığı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/trend/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when test type changes', () => {
    render(<ResultFilterBar onFilterChangeAction={mockOnFilterChange} />);

    const input = screen.getByPlaceholderText(/test adı ile ara/i);
    fireEvent.change(input, { target: { value: 'Hemoglobin' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ testType: 'Hemoglobin' })
    );
  });

  it('shows significance filter when enabled', () => {
    render(<ResultFilterBar onFilterChangeAction={mockOnFilterChange} showSignificanceFilter />);

    expect(screen.getByLabelText(/klinik önem/i)).toBeInTheDocument();
  });
});
