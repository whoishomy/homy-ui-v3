import { z } from 'zod';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import type { HealthGoalWithProgress, HealthGoalCategory } from './healthGoal';
import { InsightCategory } from './analytics';

export type TimeScale = 'day' | 'week' | 'month';
export type TimelineViewMode = 'list' | 'calendar' | 'gantt';
export type { HealthGoalCategory };

export type TimelineEventStatus = 'pending' | 'completed' | 'cancelled' | 'in-progress';

export type TimelineEventCategory = HealthGoalCategory;

export interface TimelineEvent {
  id: string;
  goalId?: string;
  title: string;
  description?: string;
  category: TimelineEventCategory;
  startDate: Date;
  endDate?: Date;
  progress: number;
  completedAt?: Date;
  isCompleted?: boolean;
  metadata?: Record<string, any>;
}

export interface TimelineGroup {
  date: Date;
  events: TimelineEvent[];
}

export const timelineFilterSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  categories: z
    .array(z.enum(['medication', 'exercise', 'nutrition', 'vitals', 'sleep', 'mental']))
    .optional(),
  viewMode: z.enum(['list', 'calendar', 'gantt']).default('list'),
  scale: z.enum(['day', 'week', 'month']).default('week'),
  showCompleted: z.boolean().default(true),
});

export type TimelineFilter = z.infer<typeof timelineFilterSchema>;

/**
 * Converts a HealthGoalWithProgress to a TimelineEvent
 */
export function goalToTimelineEvent(goal: HealthGoalWithProgress): TimelineEvent {
  return {
    id: `${goal.id}-${new Date().getTime()}`,
    goalId: goal.id,
    title: goal.title,
    category: goal.category,
    startDate: goal.startDate,
    endDate: goal.endDate,
    completedAt: goal.completedAt,
    isCompleted: goal.status === 'completed',
    progress: goal.completionRate,
  };
}

/**
 * Groups timeline events by date based on the selected scale
 */
export function groupTimelineEvents(
  events: TimelineEvent[],
  scale: TimeScale = 'week',
  startDate: Date = new Date(),
  endDate: Date = new Date()
): TimelineGroup[] {
  // Get the date range based on scale
  const start = (() => {
    switch (scale) {
      case 'day':
        return startOfDay(startDate);
      case 'week':
        return startOfWeek(startDate, { locale: tr });
      case 'month':
        return startOfMonth(startDate);
    }
  })();

  const end = (() => {
    switch (scale) {
      case 'day':
        return endOfDay(endDate);
      case 'week':
        return endOfWeek(endDate, { locale: tr });
      case 'month':
        return endOfMonth(endDate);
    }
  })();

  // Get all dates in the range based on scale
  const dates = (() => {
    switch (scale) {
      case 'day':
        return eachDayOfInterval({ start, end });
      case 'week':
        return eachWeekOfInterval({ start, end }, { locale: tr });
      case 'month':
        return eachMonthOfInterval({ start, end });
    }
  })();

  // Create a group for each date
  return dates.map((date) => {
    const groupEvents = events.filter((event) => {
      switch (scale) {
        case 'day':
          return isSameDay(event.startDate, date);
        case 'week':
          return isSameWeek(event.startDate, date, { locale: tr });
        case 'month':
          return isSameMonth(event.startDate, date);
      }
    });

    return {
      date,
      events: groupEvents,
    };
  });
}

/**
 * Filters timeline events based on the provided filter criteria
 */
export function filterTimelineEvents(
  events: TimelineEvent[],
  filter: TimelineFilter
): TimelineEvent[] {
  return events.filter((event) => {
    // Date range check
    const isInRange =
      event.startDate >= filter.startDate && (!filter.endDate || event.startDate <= filter.endDate);

    // Category check
    const matchesCategory =
      !filter.categories?.length || filter.categories.includes(event.category);

    // Completion status check
    const matchesCompletion = filter.showCompleted || !event.isCompleted;

    return isInRange && matchesCategory && matchesCompletion;
  });
}
