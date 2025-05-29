import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FieldMergeSelector } from '@/components/reminder/FieldMergeSelector';
import type { Reminder } from '@/types/reminder';

describe('FieldMergeSelector', () => {
  const mockFields: (keyof Reminder)[] = [
    'title',
    'description',
    'category',
    'date',
    'time',
    'id',
    'createdAt',
  ];

  const mockSelectedFields: (keyof Reminder)[] = ['title', 'description'];
  const mockOnFieldsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields with correct labels', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('shows correct initial state for selected fields', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Selected fields should show as "imported"
    const titleImported = screen.getByRole('radio', { name: /imported/i });
    expect(titleImported).toBeChecked();

    // Non-selected fields should show as "existing"
    const categoryExisting = screen.getByRole('radio', { name: /existing/i });
    expect(categoryExisting).toBeChecked();
  });

  it('handles field selection changes', async () => {
    const user = userEvent.setup();
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Click on a radio button for category (currently not selected)
    await user.click(screen.getAllByRole('radio', { name: /imported/i })[2]); // Category is third field

    expect(mockOnFieldsChange).toHaveBeenCalledWith([...mockSelectedFields, 'category']);
  });

  it('handles field deselection', async () => {
    const user = userEvent.setup();
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Click on a radio button for title (currently selected)
    await user.click(screen.getAllByRole('radio', { name: /existing/i })[0]); // Title is first field

    expect(mockOnFieldsChange).toHaveBeenCalledWith(['description']);
  });

  it('disables protected fields', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Check if protected fields are disabled
    const idRadios = screen.getAllByRole('radio', { name: /id/i });
    idRadios.forEach(radio => {
      expect(radio).toBeDisabled();
    });

    const createdAtRadios = screen.getAllByRole('radio', { name: /created at/i });
    createdAtRadios.forEach(radio => {
      expect(radio).toBeDisabled();
    });
  });

  it('shows protected fields notice', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    expect(screen.getByText('Protected fields cannot be modified during import')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('prevents changes to protected fields', async () => {
    const user = userEvent.setup();
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Try to click on protected field radios
    const idRadios = screen.getAllByRole('radio', { name: /id/i });
    await user.click(idRadios[0]);
    await user.click(idRadios[1]);

    expect(mockOnFieldsChange).not.toHaveBeenCalled();
  });
}); 