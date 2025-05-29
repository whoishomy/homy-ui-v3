import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, isAfter, isBefore, isToday, startOfDay } from 'date-fns';
import type { Reminder, ReminderCategory } from '@/types/reminder';

export type ReminderFilter = {
  categories: ReminderCategory[];
  status: Reminder['status'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
};

export type ReminderSort = {
  field: keyof Pick<Reminder, 'date' | 'createdAt' | 'title'>;
  direction: 'asc' | 'desc';
};

interface ReminderStore {
  reminders: Reminder[];
  filter: ReminderFilter;
  sort: ReminderSort;
  // Actions
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  setFilter: (filter: Partial<ReminderFilter>) => void;
  setSort: (sort: ReminderSort) => void;
  // Computed
  filteredReminders: () => Reminder[];
  upcomingReminders: () => Reminder[];
  todayReminders: () => Reminder[];
  overdueReminders: () => Reminder[];
  remindersByCategory: () => Record<ReminderCategory, number>;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],
      filter: {
        categories: [],
        status: ['active'],
      },
      sort: {
        field: 'date',
        direction: 'asc',
      },

      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, { ...reminder, id: crypto.randomUUID() }],
        })),

      updateReminder: (id, reminder) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...reminder, updatedAt: new Date() } : r
          ),
        })),

      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),

      setFilter: (filter) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),

      setSort: (sort) =>
        set((state) => ({
          sort,
        })),

      filteredReminders: () => {
        const { reminders, filter, sort } = get();
        let filtered = [...reminders];

        // Apply filters
        if (filter.categories.length > 0) {
          filtered = filtered.filter((r) => filter.categories.includes(r.category));
        }

        if (filter.status.length > 0) {
          filtered = filtered.filter((r) => filter.status.includes(r.status));
        }

        if (filter.dateRange) {
          filtered = filtered.filter(
            (r) =>
              isAfter(new Date(r.date), startOfDay(filter.dateRange!.start)) &&
              isBefore(new Date(r.date), filter.dateRange!.end)
          );
        }

        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.title.toLowerCase().includes(search) ||
              r.description?.toLowerCase().includes(search)
          );
        }

        // Apply sort
        filtered.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];

          if (sort.field === 'date') {
            return sort.direction === 'asc'
              ? new Date(aValue as Date).getTime() - new Date(bValue as Date).getTime()
              : new Date(bValue as Date).getTime() - new Date(aValue as Date).getTime();
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sort.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        });

        return filtered;
      },

      upcomingReminders: () => {
        const { reminders } = get();
        const now = new Date();
        return reminders.filter(
          (r) =>
            r.status === 'active' &&
            isAfter(new Date(r.date), now) &&
            !isToday(new Date(r.date))
        );
      },

      todayReminders: () => {
        const { reminders } = get();
        return reminders.filter(
          (r) => r.status === 'active' && isToday(new Date(r.date))
        );
      },

      overdueReminders: () => {
        const { reminders } = get();
        const now = new Date();
        return reminders.filter(
          (r) =>
            r.status === 'active' &&
            isBefore(new Date(r.date), now) &&
            !isToday(new Date(r.date))
        );
      },

      remindersByCategory: () => {
        const { reminders } = get();
        return reminders.reduce(
          (acc, reminder) => {
            acc[reminder.category] = (acc[reminder.category] || 0) + 1;
            return acc;
          },
          {} as Record<ReminderCategory, number>
        );
      },
    }),
    {
      name: 'reminder-store',
      version: 1,
    }
  )
); 