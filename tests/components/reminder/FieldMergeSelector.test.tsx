import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FieldMergeSelector } from '@/components/reminder/FieldMergeSelector';
import type { Reminder } from '@/types/reminder';

describe('FieldMergeSelector', () => {
  const mockFields: (keyof Reminder)[] = ['title', 'description', 'id', 'createdAt'];
  const mockSelectedFields: (keyof Reminder)[] = ['title'];
  const mockOnFieldsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Check if all field labels are rendered
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
  });

  it('shows correct initial selection', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    // Title should be set to "imported"
    const titleImportedRadio = screen.getByRole('radio', { name: /use imported title/i });
    expect(titleImportedRadio).toBeChecked();

    // Description should be set to "existing"
    const descriptionExistingRadio = screen.getByRole('radio', {
      name: /keep existing description/i,
    });
    expect(descriptionExistingRadio).toBeChecked();
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

    // Click on description's "imported" radio
    const descriptionImportedRadio = screen.getByRole('radio', {
      name: /use imported description/i,
    });
    await user.click(descriptionImportedRadio);

    expect(mockOnFieldsChange).toHaveBeenCalledWith(['title', 'description']);
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

    // Check if protected fields are disabled
    const idExistingRadio = screen.getByRole('radio', { name: /keep existing id/i });
    const idImportedRadio = screen.getByRole('radio', { name: /use imported id/i });
    expect(idExistingRadio).toBeDisabled();
    expect(idImportedRadio).toBeDisabled();

    // Try to click on protected field radios
    await user.click(idExistingRadio);
    await user.click(idImportedRadio);

    // Verify that no changes were made
    expect(mockOnFieldsChange).not.toHaveBeenCalled();
  });

  it('shows protected fields notice', () => {
    render(
      <FieldMergeSelector
        fields={mockFields}
        selectedFields={mockSelectedFields}
        onFieldsChange={mockOnFieldsChange}
      />
    );

    expect(
      screen.getByText('Protected fields cannot be modified during import')
    ).toBeInTheDocument();
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
});
