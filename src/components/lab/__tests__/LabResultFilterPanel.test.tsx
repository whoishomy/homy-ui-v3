import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, expect, describe, it, beforeEach  } from '@jest/globals';
import { axe } from 'jest-axe';
import { LabResultFilterPanel } from '../LabResultFilterPanel';

const mockFilters = {
  category: 'blood',
  status: 'normal',
  dateRange: {
    start: '2024-01-01',
    end: '2024-03-31',
  },
  hasAiInsight: true,
};

const mockOnFilterChange = jest.fn();

const renderComponent = (props = {}) => {
  return render(
    <LabResultFilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} {...props} />
  );
};

describe('LabResultFilterPanel Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders all filter sections', () => {
    renderComponent();

    // Category filter
    expect(screen.getByRole('combobox', { name: /kategori/i })).toBeInTheDocument();

    // Status filter
    expect(screen.getByRole('combobox', { name: /durum/i })).toBeInTheDocument();

    // Date range filter
    expect(screen.getByRole('group', { name: /tarih aralığı/i })).toBeInTheDocument();

    // AI insight toggle
    expect(screen.getByRole('switch', { name: /ai insight/i })).toBeInTheDocument();
  });

  it('calls onFilterChange when category is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const categorySelect = screen.getByRole('combobox', { name: /kategori/i });
    await user.selectOptions(categorySelect, 'urine');

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'urine',
      })
    );
  });

  it('maintains accessibility standards', async () => {
    const { container } = renderComponent();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles date range selection', async () => {
    const user = userEvent.setup();
    renderComponent();

    const startDateInput = screen.getByLabelText(/başlangıç tarihi/i);
    const endDateInput = screen.getByLabelText(/bitiş tarihi/i);

    await user.type(startDateInput, '2024-04-01');
    await user.type(endDateInput, '2024-04-30');

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dateRange: {
          start: '2024-04-01',
          end: '2024-04-30',
        },
      })
    );
  });

  it('toggles AI insight filter', async () => {
    const user = userEvent.setup();
    renderComponent();

    const aiToggle = screen.getByRole('switch', { name: /ai insight/i });
    await user.click(aiToggle);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        hasAiInsight: false,
      })
    );
  });

  it('resets filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const clearButton = screen.getByRole('button', { name: /filtreleri temizle/i });
    await user.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: '',
      status: '',
      dateRange: { start: '', end: '' },
      hasAiInsight: false,
    });
  });
});
