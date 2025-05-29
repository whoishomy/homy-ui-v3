import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FieldComparisonView } from '@/components/reminder/FieldComparisonView';
import type { Reminder } from '@/types/reminder';

describe('FieldComparisonView', () => {
  const baseReminder: Reminder = {
    id: 'test-1',
    title: 'Test Reminder',
    description: 'Test Description',
    category: 'health',
    date: new Date('2024-03-25'),
    time: '10:00',
    frequency: 'once',
    status: 'active',
    notificationType: 'toast',
    endDate: new Date('2024-03-26'),
    createdAt: new Date('2024-03-24'),
    updatedAt: new Date('2024-03-24'),
  };

  const existingReminder: Reminder = {
    ...baseReminder,
    title: 'Existing Title',
    description: 'Existing Description',
  };

  const importedReminder: Reminder = {
    ...baseReminder,
    title: 'Imported Title',
    description: 'Imported Description',
    category: 'work',
  };

  it('renders changed and unchanged sections', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title', 'description']}
      />
    );

    expect(screen.getByText('Changed Fields')).toBeInTheDocument();
    expect(screen.getByText('Unchanged Fields')).toBeInTheDocument();
  });

  it('shows correct field labels and values', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title', 'description']}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Existing Title')).toBeInTheDocument();
    expect(screen.getByText('Imported Title')).toBeInTheDocument();

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Existing Description')).toBeInTheDocument();
    expect(screen.getByText('Imported Description')).toBeInTheDocument();
  });

  it('formats date fields correctly', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['date', 'endDate']}
      />
    );

    const formattedDate = new Date('2024-03-25').toLocaleDateString();
    const formattedEndDate = new Date('2024-03-26').toLocaleDateString();

    expect(screen.getAllByText(formattedDate)).toHaveLength(2); // Both existing and imported
    expect(screen.getAllByText(formattedEndDate)).toHaveLength(2);
  });

  it('shows correct icons for different field states', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title']} // Only title is selected for update
      />
    );

    // Title row should have arrow icon (will change)
    const titleRow = screen.getByText('Title').closest('div[class*="grid"]');
    expect(titleRow).toHaveClass('border-primary/50');

    // Description row should have X icon (changed but not selected)
    const descriptionRow = screen.getByText('Description').closest('div[class*="grid"]');
    expect(descriptionRow).not.toHaveClass('border-primary/50');

    // Time row should have check icon (unchanged)
    const timeRow = screen.getByText('Time').closest('div[class*="grid"]');
    expect(timeRow).not.toHaveClass('border-primary/50');
  });

  it('handles protected fields correctly', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['id', 'createdAt', 'title']} // Including protected fields
      />
    );

    // Protected fields should be styled differently
    const idRow = screen.getByText('ID').closest('div[class*="grid"]');
    expect(idRow).toHaveClass('opacity-50');

    const createdAtRow = screen.getByText('Created At').closest('div[class*="grid"]');
    expect(createdAtRow).toHaveClass('opacity-50');
  });

  it('shows legend with correct icons', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title']}
      />
    );

    expect(screen.getByText('Will be updated')).toBeInTheDocument();
    expect(screen.getByText('Will keep existing')).toBeInTheDocument();
    expect(screen.getByText('No change needed')).toBeInTheDocument();
  });

  it('handles empty or null values', () => {
    const reminderWithNulls: Reminder = {
      ...baseReminder,
      description: null as any,
      endDate: undefined,
    };

    render(
      <FieldComparisonView
        existingReminder={reminderWithNulls}
        importedReminder={importedReminder}
        selectedFields={['description', 'endDate']}
      />
    );

    expect(screen.getAllByText('—')).toHaveLength(2); // For null and undefined values
  });

  it('applies custom className', () => {
    const { container } = render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title']}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('highlights fields that will change', () => {
    render(
      <FieldComparisonView
        existingReminder={existingReminder}
        importedReminder={importedReminder}
        selectedFields={['title', 'category']}
      />
    );

    // Selected changed fields should be highlighted
    const titleValue = screen.getByText('Imported Title');
    expect(titleValue).toHaveClass('text-primary');

    const categoryValue = screen.getByText('work');
    expect(categoryValue).toHaveClass('text-primary');
  });
}); 