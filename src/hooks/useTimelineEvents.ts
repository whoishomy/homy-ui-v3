import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimelineEvent } from '@/types/timeline';

interface TimelineState {
  events: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, event: Partial<TimelineEvent>) => void;
  deleteEvent: (id: string) => void;
  loading: boolean;
  error: string | null;
}

export const useTimelineEvents = create<TimelineState>()(
  persist(
    (set) => ({
      events: [],
      loading: false,
      error: null,
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: 'timeline-events',
    }
  )
); 