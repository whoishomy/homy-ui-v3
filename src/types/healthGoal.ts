import { z } from 'zod';
import { addDays, addWeeks, addMonths } from 'date-fns';
import { HealthMetric } from './healthMetric';
import { InsightCategory } from './analytics';

export type HealthMetricType = 'number' | 'boolean' | 'range' | 'options';
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
  type: z.enum(['number', 'boolean', 'range', 'options']),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).optional(),
  targetValue: z.union([z.number(), z.boolean(), z.string()]),
  warningThreshold: z.number().optional(),
  criticalThreshold: z.number().optional(),
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
  reminders: z.array(z.string()), // Reminder IDs
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface HealthProgress {
  id: string;
  goalId: string;
  date: Date;
  metrics: Record<string, string | number | boolean>;
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthGoal {
  id: string;
  title: string;
  description?: string;
  category: InsightCategory;
  startDate: Date;
  endDate?: Date;
  status: HealthGoalStatus;
  frequency: HealthGoalFrequency;
  metrics: HealthMetric[];
  reminders: boolean;
  tags?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface HealthGoalWithProgress extends HealthGoal {
  progress: HealthProgress[];
  completionRate: number;
  streak: number;
  nextDue: Date | null;
}

export type HealthMetric = z.infer<typeof healthMetricSchema>;
export type HealthGoal = z.infer<typeof healthGoalSchema>;
export type HealthProgress = z.infer<typeof healthProgressSchema>;

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
    progress: 0, // Initial progress starts at 0
    completionRate: 0, // Initial completion rate starts at 0
    streak: 0, // Initial streak starts at 0
    nextDue: calculateNextDueDate(input),
    severity: input.status === 'active' ? 'normal' : 'none', // Default severity based on status
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
