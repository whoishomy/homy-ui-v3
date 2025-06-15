import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldComparisonView } from '@/components/reminder/FieldComparisonView';

const mockExistingReminder = {
  title: 'Existing Title',
  description: 'Existing Description',
  startDate: new Date('2024-03-25'),
  endDate: new Date('2024-03-26'),
  time: '10:00',
  category: 'personal',
};

const mockImportedReminder = {
  title: 'Imported Title',
  description: 'Imported Description',
  startDate: new Date('2024-03-25'),
  endDate: new Date('2024-03-26'),
  time: '10:00',
  category: 'work',
};

describe('FieldComparisonView', () => {
  it('renders content section with title and description', () => {
    render(
      <FieldComparisonView
        existingReminder={mockExistingReminder}
        importedReminder={mockImportedReminder}
      />
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('The main content and purpose of the reminder')).toBeInTheDocument();
  });

  it('formats date fields correctly', () => {
    render(
      <FieldComparisonView
        existingReminder={mockExistingReminder}
        importedReminder={mockImportedReminder}
      />
    );

    const formattedDate = mockExistingReminder.startDate.toLocaleDateString();
    const formattedEndDate = mockExistingReminder.endDate.toLocaleDateString();

    expect(screen.getAllByText(formattedDate)).toHaveLength(2); // Both existing and imported
    expect(screen.getAllByText(formattedEndDate)).toHaveLength(2);
  });

  it('shows correct icons for different field states', () => {
    render(
      <FieldComparisonView
        existingReminder={mockExistingReminder}
        importedReminder={mockImportedReminder}
      />
    );

    // Title row should have arrow icon (changed)
    const titleRow = screen.getByText('Title').closest('div[class*="grid"]');
    expect(titleRow).toHaveClass('border-primary/50');

    // Description row should have arrow icon (changed)
    const descriptionRow = screen.getByText('Description').closest('div[class*="grid"]');
    expect(descriptionRow).toHaveClass('border-primary/50');

    // Time row should have check icon (unchanged)
    const timeRow = screen.getByText('Time').closest('div[class*="grid"]');
    expect(timeRow).not.toHaveClass('border-primary/50');
  });

  it('highlights fields that will change', () => {
    render(
      <FieldComparisonView
        existingReminder={mockExistingReminder}
        importedReminder={mockImportedReminder}
      />
    );

    const categoryValue = screen.getByText('work');
    expect(categoryValue).toHaveClass('text-primary');
  });
});
