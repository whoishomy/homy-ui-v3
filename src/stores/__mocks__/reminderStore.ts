import { create } from 'zustand';
import type { Reminder, ReminderFilter } from '@/types/Reminder';

interface ReminderState {
  reminders: Reminder[];
  filter: ReminderFilter;
  selectedIds: string[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  setFilter: (filter: Partial<ReminderFilter>) => void;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  selectAll: () => void;
}

export const useReminderStore = jest.fn().mockImplementation(() => ({
  reminders: [],
  filter: {
    categories: [],
    status: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'asc',
  },
  selectedIds: [],
  addReminder: jest.fn(),
  updateReminder: jest.fn(),
  deleteReminder: jest.fn(),
  setFilter: jest.fn(),
  toggleSelected: jest.fn(),
  clearSelected: jest.fn(),
  selectAll: jest.fn(),
}));
