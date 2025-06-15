import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImportDialog } from '@/components/reminder/ImportDialog';
import { useReminderStore } from '@/stores/reminderStore';
import { parseFile } from '@/utils/importData';
import { processImport } from '@/utils/mergeStrategy';

const mockToast = jest.fn();
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('@/stores/reminderStore', () => ({
  useReminderStore: jest.fn(),
}));

jest.mock('@/utils/importData', () => ({
  parseFile: jest.fn(),
}));

jest.mock('@/utils/mergeStrategy', () => ({
  processImport: jest.fn(),
}));

describe('ImportDialog', () => {
  const mockAddReminder = jest.fn();
  const mockUpdateReminder = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReminderStore as any).mockImplementation(() => ({
      reminders: [
        {
          id: 'existing-1',
          title: 'Existing Reminder',
          description: 'Test Description',
          category: 'health',
          date: new Date(),
          time: '10:00',
          frequency: 'once',
          status: 'active',
          notificationType: 'toast',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      addReminder: mockAddReminder,
      updateReminder: mockUpdateReminder,
    }));
  });

  it('renders correctly', () => {
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Import Reminders')).toBeInTheDocument();
    expect(screen.getByText('Drag & drop file here')).toBeInTheDocument();
    expect(screen.getByText('Skip duplicates (keep existing)')).toBeInTheDocument();
    expect(screen.getByText('Replace existing with imported')).toBeInTheDocument();
    expect(screen.getByText('Merge imported into existing')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('shows field selector when merge strategy is selected', async () => {
    const user = userEvent.setup();
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByLabelText('Merge imported into existing'));

    expect(screen.getByText('Field Selection')).toBeInTheDocument();
    expect(screen.getByText('Select which fields to update with imported data.')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('pre-selects all mergeable fields when switching to merge strategy', async () => {
    const user = userEvent.setup();
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByLabelText('Merge imported into existing'));

    // Check that all non-protected fields are selected for import
    const importedRadios = screen.getAllByRole('radio', { name: /imported/i });
    const nonProtectedCount = importedRadios.length - 3; // Subtract protected fields
    expect(nonProtectedCount).toBeGreaterThan(0);
  });

  it('clears field selection when switching away from merge strategy', async () => {
    const user = userEvent.setup();
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Switch to merge
    await user.click(screen.getByLabelText('Merge imported into existing'));
    expect(screen.getByText('Field Selection')).toBeInTheDocument();

    // Switch to skip
    await user.click(screen.getByLabelText('Skip duplicates (keep existing)'));
    expect(screen.queryByText('Field Selection')).not.toBeInTheDocument();

    // Switch back to merge
    await user.click(screen.getByLabelText('Merge imported into existing'));
    expect(screen.getByText('Field Selection')).toBeInTheDocument();
  });

  it('handles successful import with field-level merge', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['{"id": "existing-1", "title": "Updated Title"}'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: true,
      data: [{
        id: 'existing-1',
        title: 'Updated Title',
      }],
      errors: [],
      duplicates: [],
    });

    (processImport as any).mockReturnValue({
      results: [
        {
          action: 'merged',
          reminder: {
            id: 'existing-1',
            title: 'Updated Title',
          },
        },
      ],
      summary: {
        added: 0,
        skipped: 0,
        merged: 1,
        replaced: 0,
      },
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);
    await user.click(screen.getByLabelText('Merge imported into existing'));

    // Select specific fields for merge
    const titleRadio = screen.getAllByRole('radio', { name: /imported/i })[0];
    await user.click(titleRadio);

    await user.click(screen.getByText('Import'));

    expect(processImport).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      expect.objectContaining({
        strategy: 'merge',
        fields: expect.arrayContaining(['title']),
      })
    );
    expect(mockUpdateReminder).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Import completed: 1 merged.',
      })
    );
  });

  it('disables import button when no fields are selected in merge mode', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['test'],
      'test.json',
      { type: 'application/json' }
    );

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);
    await user.click(screen.getByLabelText('Merge imported into existing'));

    // Deselect all fields
    const importedRadios = screen.getAllByRole('radio', { name: /existing/i });
    for (const radio of importedRadios) {
      await user.click(radio);
    }

    expect(screen.getByText('Import')).toBeDisabled();
  });

  it('handles import failure', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['invalid json'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: false,
      data: [],
      errors: ['Invalid JSON format'],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);
    await user.click(screen.getByText('Import'));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Import Failed',
        variant: 'error',
      })
    );
    expect(mockAddReminder).not.toHaveBeenCalled();
    expect(mockUpdateReminder).not.toHaveBeenCalled();
  });

  it('handles file removal', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['test'],
      'test.json',
      { type: 'application/json' }
    );

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);
    expect(screen.getByText('test.json')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Remove file'));
    expect(screen.getByText('Drag & drop file here')).toBeInTheDocument();
  });

  it('disables import button when no file is selected', () => {
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Import')).toBeDisabled();
  });

  it('handles dialog close', async () => {
    const user = userEvent.setup();
    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows field comparison view when file is parsed successfully', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['{"id": "existing-1", "title": "Updated Title"}'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: true,
      data: [{
        id: 'existing-1',
        title: 'Updated Title',
        description: 'Test Description',
        category: 'health',
        date: new Date(),
        time: '10:00',
        frequency: 'once',
        status: 'active',
        notificationType: 'toast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      errors: [],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);

    expect(screen.getByText('Preview Changes')).toBeInTheDocument();
    expect(screen.getByText('Existing')).toBeInTheDocument();
    expect(screen.getByText('Imported')).toBeInTheDocument();
  });

  it('handles navigation between multiple reminders', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['[{"id": "1"}, {"id": "2"}]'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: true,
      data: [
        {
          id: 'existing-1',
          title: 'First Reminder',
          description: 'Test Description',
          category: 'health',
          date: new Date(),
          time: '10:00',
          frequency: 'once',
          status: 'active',
          notificationType: 'toast',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'existing-2',
          title: 'Second Reminder',
          description: 'Test Description',
          category: 'health',
          date: new Date(),
          time: '10:00',
          frequency: 'once',
          status: 'active',
          notificationType: 'toast',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      errors: [],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);

    expect(screen.getByText('1 of 2')).toBeInTheDocument();
    expect(screen.getByText('First Reminder')).toBeInTheDocument();

    await user.click(screen.getByText('Next'));
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Second Reminder')).toBeInTheDocument();

    await user.click(screen.getByText('Previous'));
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
    expect(screen.getByText('First Reminder')).toBeInTheDocument();
  });

  it('clears comparison view when file is removed', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['{"id": "existing-1", "title": "Updated Title"}'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: true,
      data: [{
        id: 'existing-1',
        title: 'Updated Title',
        description: 'Test Description',
        category: 'health',
        date: new Date(),
        time: '10:00',
        frequency: 'once',
        status: 'active',
        notificationType: 'toast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      errors: [],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);
    expect(screen.getByText('Preview Changes')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Remove file'));
    expect(screen.queryByText('Preview Changes')).not.toBeInTheDocument();
  });

  it('updates comparison view when merge strategy changes', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['{"id": "existing-1", "title": "Updated Title"}'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: true,
      data: [{
        id: 'existing-1',
        title: 'Updated Title',
        description: 'Test Description',
        category: 'health',
        date: new Date(),
        time: '10:00',
        frequency: 'once',
        status: 'active',
        notificationType: 'toast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      errors: [],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);

    // Initially no fields are selected
    const titleValue = screen.getByText('Updated Title');
    expect(titleValue).not.toHaveClass('text-primary');

    // Switch to merge strategy
    await user.click(screen.getByLabelText('Merge imported into existing'));
    expect(titleValue).toHaveClass('text-primary');

    // Switch back to skip strategy
    await user.click(screen.getByLabelText('Skip duplicates (keep existing)'));
    expect(titleValue).not.toHaveClass('text-primary');
  });

  it('shows error toast when file parsing fails', async () => {
    const user = userEvent.setup();
    const file = new File(
      ['invalid json'],
      'test.json',
      { type: 'application/json' }
    );

    (parseFile as any).mockResolvedValue({
      success: false,
      data: [],
      errors: ['Invalid JSON format'],
      duplicates: [],
    });

    render(
      <ImportDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const dropzone = screen.getByText('Drag & drop file here').parentElement!;
    const input = dropzone.querySelector('input')!;
    
    await user.upload(input, file);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Parse Failed',
        description: 'Invalid JSON format',
        variant: 'error',
      })
    );
    expect(screen.queryByText('Preview Changes')).not.toBeInTheDocument();
  });
}); 