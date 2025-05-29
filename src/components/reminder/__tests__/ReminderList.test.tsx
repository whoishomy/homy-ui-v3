import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { ReminderList } from '../ReminderList';
import { useReminderStore } from '@/stores/reminderStore';
import type { Reminder } from '@/types/reminder';

const mockToast = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'İlaç Hatırlatıcısı',
    description: 'Tansiyon ilacı',
    category: 'medication',
    date: new Date('2024-03-20'),
    time: '10:00',
    frequency: 'daily',
    status: 'active',
    notificationType: 'toast',
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-19'),
  },
  {
    id: '2',
    title: 'Egzersiz Zamanı',
    category: 'exercise',
    date: new Date('2024-03-21'),
    time: '08:00',
    frequency: 'weekly',
    status: 'active',
    notificationType: 'toast',
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-19'),
  },
];

vi.mock('@/stores/reminderStore', () => ({
  useReminderStore: vi.fn(),
}));

describe('ReminderList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useReminderStore as any).mockImplementation(() => ({
      reminders: mockReminders,
      filter: {
        categories: [],
        status: ['active'],
      },
      sort: {
        field: 'date',
        direction: 'asc',
      },
      filteredReminders: () => mockReminders,
      todayReminders: () => [],
      upcomingReminders: () => mockReminders,
      overdueReminders: () => [],
      remindersByCategory: () => ({
        medication: 1,
        exercise: 1,
        health: 0,
        general: 0,
      }),
      setFilter: vi.fn(),
      setSort: vi.fn(),
      deleteReminder: vi.fn(),
      updateReminder: vi.fn(),
    }));
  });

  it('renders all reminders correctly', () => {
    render(<ReminderList />);

    expect(screen.getByText('İlaç Hatırlatıcısı')).toBeInTheDocument();
    expect(screen.getByText('Egzersiz Zamanı')).toBeInTheDocument();
  });

  it('shows correct stats', () => {
    render(<ReminderList />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Total
    expect(screen.getByText('2')).toBeInTheDocument(); // Upcoming
  });

  it('filters reminders by search', async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      setFilter: mockSetFilter,
    }));

    render(<ReminderList />);

    const searchInput = screen.getByPlaceholderText(/hatırlatıcı ara/i);
    await user.type(searchInput, 'ilaç');

    expect(mockSetFilter).toHaveBeenCalledWith({ search: 'ilaç' });
  });

  it('filters reminders by category', async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      setFilter: mockSetFilter,
    }));

    render(<ReminderList />);

    const medicationButton = screen.getByText(/ilaç/i);
    await user.click(medicationButton);

    expect(mockSetFilter).toHaveBeenCalledWith({
      categories: ['medication'],
    });
  });

  it('sorts reminders', async () => {
    const user = userEvent.setup();
    const mockSetSort = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      setSort: mockSetSort,
    }));

    render(<ReminderList />);

    const dateButton = screen.getByText(/tarih/i);
    await user.click(dateButton);

    expect(mockSetSort).toHaveBeenCalledWith({
      field: 'date',
      direction: 'desc',
    });
  });

  it('handles reminder deletion', async () => {
    const user = userEvent.setup();
    const mockDeleteReminder = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      deleteReminder: mockDeleteReminder,
    }));

    render(<ReminderList />);

    const moreButton = screen.getAllByRole('button')[6]; // More options button
    await user.click(moreButton);

    const deleteButton = screen.getByText(/sil/i);
    await user.click(deleteButton);

    expect(mockDeleteReminder).toHaveBeenCalledWith('1');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hatırlatıcı silindi',
        variant: 'success',
      })
    );
  });

  it('handles reminder status change', async () => {
    const user = userEvent.setup();
    const mockUpdateReminder = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      updateReminder: mockUpdateReminder,
    }));

    render(<ReminderList />);

    const moreButton = screen.getAllByRole('button')[6]; // More options button
    await user.click(moreButton);

    const completeButton = screen.getByText(/tamamlandı olarak işaretle/i);
    await user.click(completeButton);

    expect(mockUpdateReminder).toHaveBeenCalledWith('1', {
      status: 'completed',
    });
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Durum güncellendi',
        variant: 'success',
      })
    );
  });

  it('shows empty state when no reminders', () => {
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      filteredReminders: () => [],
    }));

    render(<ReminderList />);

    expect(
      screen.getByText(/gösterilecek hatırlatıcı bulunamadı/i)
    ).toBeInTheDocument();
  });

  it('handles reminder selection', async () => {
    const user = userEvent.setup();
    render(<ReminderList />);

    const checkboxes = screen.getAllByRole('button', { name: '' });
    await user.click(checkboxes[1]); // First reminder checkbox
    await user.click(checkboxes[2]); // Second reminder checkbox

    expect(screen.getByText('2 seçili')).toBeInTheDocument();
  });

  it('handles select all', async () => {
    const user = userEvent.setup();
    render(<ReminderList />);

    const selectAllButton = screen.getByText('Tümünü Seç');
    await user.click(selectAllButton);

    expect(screen.getByText('2 seçili')).toBeInTheDocument();
    expect(screen.getByText('Seçimi Kaldır')).toBeInTheDocument();

    await user.click(screen.getByText('Seçimi Kaldır'));
    expect(screen.getByText('Tümünü Seç')).toBeInTheDocument();
  });

  it('clears selection when bulk actions are completed', async () => {
    const user = userEvent.setup();
    const mockUpdateReminder = vi.fn();
    (useReminderStore as any).mockImplementation(() => ({
      ...useReminderStore(),
      updateReminder: mockUpdateReminder,
    }));

    render(<ReminderList />);

    const selectAllButton = screen.getByText('Tümünü Seç');
    await user.click(selectAllButton);

    await user.click(screen.getByText('Tamamlandı'));

    expect(mockUpdateReminder).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Tümünü Seç')).toBeInTheDocument();
  });

  it('maintains selection when filtering', async () => {
    const user = userEvent.setup();
    render(<ReminderList />);

    const checkboxes = screen.getAllByRole('button', { name: '' });
    await user.click(checkboxes[1]); // Select first reminder

    const searchInput = screen.getByPlaceholderText(/hatırlatıcı ara/i);
    await user.type(searchInput, 'ilaç');

    expect(screen.getByText('1 seçili')).toBeInTheDocument();
  });
}); 