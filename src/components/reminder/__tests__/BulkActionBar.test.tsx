import { describe, it, expect, beforeEach  } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest  } from '@jest/globals';

import { BulkActionBar } from '../BulkActionBar';
import { useReminderStore } from '@/stores/reminderStore';
import { exportToCalendar } from '@/utils/exportToCalendar';

const mockToast = jest.fn();
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('@/stores/reminderStore', () => ({
  useReminderStore: jest.fn(),
}));

jest.mock('@/utils/exportToCalendar', () => ({
  exportToCalendar: jest.fn(),
}));

describe('BulkActionBar', () => {
  const mockUpdateReminder = jest.fn();
  const mockDeleteReminder = jest.fn();
  const mockOnClearSelection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReminderStore as any).mockImplementation(() => ({
      updateReminder: mockUpdateReminder,
      deleteReminder: mockDeleteReminder,
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
    expect(screen.getByText('Takvime Aktar')).toBeInTheDocument();
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
        message: 'Hatırlatıcılar tamamlandı',
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
        message: 'Hatırlatıcılar silindi',
        variant: 'success',
      })
    );
    expect(mockOnClearSelection).toHaveBeenCalled();
  });

  it('handles export to calendar action', async () => {
    const mockReminders = [
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
    ];

    (useReminderStore as any).mockImplementation(() => ({
      reminders: mockReminders,
      updateReminder: mockUpdateReminder,
      deleteReminder: mockDeleteReminder,
    }));

    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('Takvime Aktar'));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Takvim Dışa Aktarıldı',
        message: 'Takvim dışa aktarıldı',
        variant: 'success',
      })
    );
  });

  it('handles errors during calendar export', async () => {
    const mockError = new Error('Export failed');
    jest.mock('@/utils/exportToCalendar', () => ({
      exportToCalendar: jest.fn().mockImplementation(() => {
        throw mockError;
      }),
    }));

    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('Takvime Aktar'));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hata',
        message: 'Hata oluştu',
        variant: 'error',
      })
    );
  });

  it('handles errors during bulk actions', async () => {
    const mockError = new Error('Test error');
    (useReminderStore as any).mockImplementation(() => ({
      updateReminder: jest.fn().mockRejectedValue(mockError),
      deleteReminder: jest.fn().mockRejectedValue(mockError),
    }));

    const user = userEvent.setup();
    render(
      <BulkActionBar
        selectedIds={['1', '2']}
        onClearSelection={mockOnClearSelection}
      />
    );

    await user.click(screen.getByText('Tamamlandı'));
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hata',
        message: 'Hata oluştu',
        description: 'Hatırlatıcılar güncellenirken bir hata oluştu.',
        variant: 'error',
      })
    );

    await user.click(screen.getByText('Sil'));
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hata',
        message: 'Hata oluştu',
        description: 'Hatırlatıcılar silinirken bir hata oluştu.',
        variant: 'error',
      })
    );
  });
}); 