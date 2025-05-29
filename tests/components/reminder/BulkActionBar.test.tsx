import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { BulkActionBar } from '@/components/reminder/BulkActionBar';
import { useReminderStore } from '@/stores/reminderStore';
import { exportToCalendar } from '@/utils/exportToCalendar';
import { exportToJSON, exportToCSV } from '@/utils/exportData';

const mockToast = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('@/stores/reminderStore', () => ({
  useReminderStore: vi.fn(),
}));

vi.mock('@/utils/exportToCalendar', () => ({
  exportToCalendar: vi.fn(),
}));

vi.mock('@/utils/exportData', () => ({
  exportToJSON: vi.fn(),
  exportToCSV: vi.fn(),
}));

describe('BulkActionBar', () => {
  const mockUpdateReminder = vi.fn();
  const mockDeleteReminder = vi.fn();
  const mockOnClearSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useReminderStore as any).mockImplementation(() => ({
      updateReminder: mockUpdateReminder,
      deleteReminder: mockDeleteReminder,
      reminders: [
        {
          id: '1',
          title: 'Test Reminder 1',
          description: 'Test Description 1',
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
          id: '2',
          title: 'Test Reminder 2',
          description: 'Test Description 2',
          category: 'health',
          date: new Date(),
          time: '14:00',
          frequency: 'once',
          status: 'active',
          notificationType: 'toast',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));
  });

  it('renders correctly with selected items', () => {
    render(
      <BulkActionBar
        selectedIds={['1', '2', '3']}
        onClearSelection={mockOnClearSelection}
      />
    );

    expect(screen.getByText('3 seçili')).toBeInTheDocument();
    expect(screen.getByText('Tamamlandı')).toBeInTheDocument();
    expect(screen.getByText('Dışa Aktar')).toBeInTheDocument();
    expect(screen.getByText('İçe Aktar')).toBeInTheDocument();
    expect(screen.getByText('Sil')).toBeInTheDocument();
    expect(screen.getByText('İptal')).toBeInTheDocument();
  });

  it('handles bulk complete action', async () => {
    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('Tamamlandı'));

    expect(mockUpdateReminder).toHaveBeenCalledTimes(2);
    expect(mockUpdateReminder).toHaveBeenCalledWith('1', { status: 'completed' });
    expect(mockUpdateReminder).toHaveBeenCalledWith('2', { status: 'completed' });
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hatırlatıcılar tamamlandı',
        variant: 'success',
      })
    );
    expect(mockOnClearSelection).toHaveBeenCalled();
  });

  it('handles bulk delete action', async () => {
    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('Sil'));

    expect(mockDeleteReminder).toHaveBeenCalledTimes(2);
    expect(mockDeleteReminder).toHaveBeenCalledWith('1');
    expect(mockDeleteReminder).toHaveBeenCalledWith('2');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hatırlatıcılar silindi',
        variant: 'success',
      })
    );
    expect(mockOnClearSelection).toHaveBeenCalled();
  });

  describe('Export Actions', () => {
    it('shows export options dropdown when clicking export button', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('Dışa Aktar'));

      expect(screen.getByText('Takvime Aktar')).toBeInTheDocument();
      expect(screen.getByText('JSON Olarak İndir')).toBeInTheDocument();
      expect(screen.getByText('CSV Olarak İndir')).toBeInTheDocument();
    });

    it('handles calendar export action', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('Dışa Aktar'));
      await user.click(screen.getByText('Takvime Aktar'));

      expect(exportToCalendar).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' })
      ]));
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Takvim Dışa Aktarıldı',
          variant: 'success',
        })
      );
    });

    it('handles JSON export action', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('Dışa Aktar'));
      await user.click(screen.getByText('JSON Olarak İndir'));

      expect(exportToJSON).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' })
      ]));
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'JSON Dışa Aktarıldı',
          variant: 'success',
        })
      );
    });

    it('handles CSV export action', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('Dışa Aktar'));
      await user.click(screen.getByText('CSV Olarak İndir'));

      expect(exportToCSV).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' })
      ]));
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'CSV Dışa Aktarıldı',
          variant: 'success',
        })
      );
    });

    it('handles export errors gracefully', async () => {
      const mockError = new Error('Export failed');
      (exportToJSON as any).mockImplementation(() => {
        throw mockError;
      });

      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('Dışa Aktar'));
      await user.click(screen.getByText('JSON Olarak İndir'));

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Hata',
          variant: 'error',
          description: 'JSON dışa aktarılırken bir hata oluştu.',
        })
      );
    });
  });

  describe('Import Dialog', () => {
    it('opens import dialog when clicking import button', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('İçe Aktar'));
      expect(screen.getByText('Import Reminders')).toBeInTheDocument();
    });

    it('closes import dialog when clicking cancel', async () => {
      const user = userEvent.setup();
      render(
        <BulkActionBar
          selectedIds={['1', '2']}
          onClearSelection={mockOnClearSelection}
        />
      );

      await user.click(screen.getByText('İçe Aktar'));
      await user.click(screen.getByText('Cancel'));
      
      expect(screen.queryByText('Import Reminders')).not.toBeInTheDocument();
    });
  });

  it('handles clear selection', async () => {
    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('İptal'));
    expect(mockOnClearSelection).toHaveBeenCalled();
  });
}); 