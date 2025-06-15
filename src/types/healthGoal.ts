import { z } from 'zod';
import { addDays, addWeeks, addMonths } from 'date-fns';
import type { HealthMetric } from './healthMetric';
import { InsightCategory } from './analytics';

export type HealthMetricType = 'number' | 'boolean' | 'range' | 'select';
export type HealthGoalFrequency = 'daily' | 'weekly' | 'monthly';
export type HealthGoalCategory =
  | 'exercise'
  | 'nutrition'
  | 'sleep'
  | 'mental'
  | 'medication'
  | 'vitals';
export type HealthGoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export const healthMetricSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['number', 'boolean', 'range', 'select']),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).optional(),
  targetValue: z.union([z.number(), z.boolean(), z.string()]),
  warningThreshold: z.number().optional(),
  criticalThreshold: z.number().optional(),
});

export const healthProgressSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  date: z.date(),
  metrics: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  notes: z.string().optional(),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const healthGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['medication', 'exercise', 'nutrition', 'vitals', 'sleep', 'mental']),
  startDate: z.date(),
  endDate: z.date().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  status: z.enum(['active', 'completed', 'paused', 'abandoned']),
  metrics: z.array(healthMetricSchema),
  reminders: z.boolean(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type HealthProgress = z.infer<typeof healthProgressSchema>;
export type HealthGoal = z.infer<typeof healthGoalSchema>;

export interface HealthGoalWithProgress extends HealthGoal {
  progress: HealthProgress[];
  completionRate: number;
  streak: number;
  nextDue: Date | null;
  completedAt?: Date;
}

/**
 * Calculates the next due date based on the goal's frequency and start date
 */
export function calculateNextDueDate(goal: HealthGoal): Date {
  const today = new Date();
  const startDate = new Date(goal.startDate);

  // If start date is in the future, that's the next due date
  if (startDate > today) {
    return startDate;
  }

  switch (goal.frequency) {
    case 'daily':
      return addDays(today, 1);
    case 'weekly':
      return addWeeks(today, 1);
    case 'monthly':
      return addMonths(today, 1);
    default:
      return today;
  }
}

/**
 * Transforms a HealthGoal (form input) into a HealthGoalWithProgress (domain model)
 */
export function formToGoal(input: HealthGoal): HealthGoalWithProgress {
  return {
    ...input,
    progress: [], // Initial progress starts empty
    completionRate: 0, // Initial completion rate starts at 0
    streak: 0, // Initial streak starts at 0
    nextDue: calculateNextDueDate(input),
  };
}

/**
 * Updates the progress-related fields of a goal based on its current state
 */
export function updateGoalProgress(goal: HealthGoalWithProgress): HealthGoalWithProgress {
  // This will be implemented later to handle progress updates
  // For now, we just return the goal as is
  return goal;
}
