import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addDays, startOfDay, isSameDay, differenceInDays } from 'date-fns';

import type {
  HealthGoal,
  HealthProgress,
  HealthGoalWithProgress,
  HealthMetric,
  HealthGoalCategory
} from '@/types/healthGoal';
import { formToGoal, updateGoalProgress } from '@/types/healthGoal';

interface HealthGoalState {
  goals: HealthGoalWithProgress[];
  progress: HealthProgress[];
  
  // Goal Management
  addGoal: (goal: HealthGoalWithProgress) => void;
  updateGoal: (id: string, goal: HealthGoal) => void;
  deleteGoal: (id: string) => void;
  
  // Progress Tracking
  addProgress: (progress: Omit<HealthProgress, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProgress: (id: string, updates: Partial<HealthProgress>) => void;
  deleteProgress: (id: string) => void;
  
  // Queries
  getGoalById: (id: string) => HealthGoalWithProgress | null;
  getActiveGoals: () => HealthGoalWithProgress[];
  getGoalsByCategory: (category: HealthGoalCategory) => HealthGoalWithProgress[];
  getDueGoals: (date?: Date) => HealthGoalWithProgress[];
  
  // Analytics
  getCompletionRate: (goalId: string) => number;
  getStreak: (goalId: string) => number;
  getNextDueDate: (goalId: string) => Date | null;

  updateGoalProgress: (id: string) => void;
}

const calculateCompletionRate = (goal: HealthGoal, progress: HealthProgress[]): number => {
  const goalProgress = progress.filter(p => p.goalId === goal.id);
  if (goalProgress.length === 0) return 0;

  const totalMetrics = goal.metrics.length * goalProgress.length;
  const completedMetrics = goalProgress.reduce((acc, p) => {
    return acc + Object.keys(p.metrics).length;
  }, 0);

  return (completedMetrics / totalMetrics) * 100;
};

const calculateStreak = (goal: HealthGoal, progress: HealthProgress[]): number => {
  const goalProgress = progress
    .filter(p => p.goalId === goal.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  if (goalProgress.length === 0) return 0;

  let streak = 1;
  const today = startOfDay(new Date());

  // Check if the streak is broken by missing today
  if (!isSameDay(goalProgress[0].date, today)) {
    return 0;
  }

  for (let i = 1; i < goalProgress.length; i++) {
    const curr = startOfDay(goalProgress[i].date);
    const prev = startOfDay(goalProgress[i - 1].date);
    
    const dayDiff = differenceInDays(prev, curr);
    if (dayDiff !== 1) break;
    
    streak++;
  }

  return streak;
};

const calculateNextDueDate = (goal: HealthGoal, progress: HealthProgress[]): Date | null => {
  if (goal.status !== 'active') return null;

  const latestProgress = progress
    .filter(p => p.goalId === goal.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  if (!latestProgress) {
    return startOfDay(new Date());
  }

  const lastDate = startOfDay(latestProgress.date);
  const today = startOfDay(new Date());

  if (isSameDay(lastDate, today)) {
    switch (goal.frequency) {
      case 'daily':
        return addDays(today, 1);
      case 'weekly':
        return addDays(today, 7);
      case 'monthly':
        return addDays(today, 30);
    }
  }

  return today;
};

export const useHealthGoalStore = create<HealthGoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      progress: [],

      addGoal: (goal) => {
        set((state) => ({
          goals: [...state.goals, goal],
        }));
      },

      updateGoal: (id, goal) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? {
                  ...formToGoal(goal),
                  id,
                  createdAt: g.createdAt,
                  updatedAt: new Date(),
                  // Preserve progress-related fields from the existing goal
                  progress: g.progress,
                  completionRate: g.completionRate,
                  streak: g.streak,
                  nextDue: g.nextDue,
                }
              : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
          progress: state.progress.filter(p => p.goalId !== id),
        }));
      },

      addProgress: (progressData) => {
        const id = uuidv4();
        const now = new Date();
        const progress: HealthProgress = {
          ...progressData,
          id,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          progress: [...state.progress, progress],
        }));

        return id;
      },

      updateProgress: (id, updates) => {
        set(state => ({
          progress: state.progress.map(progress =>
            progress.id === id
              ? { ...progress, ...updates, updatedAt: new Date() }
              : progress
          ),
        }));
      },

      deleteProgress: (id) => {
        set(state => ({
          progress: state.progress.filter(p => p.id !== id),
        }));
      },

      getGoalById: (id) => {
        const { goals, progress } = get();
        const goal = goals.find(g => g.id === id);
        if (!goal) return null;

        const goalProgress = progress.filter(p => p.goalId === id);
        return {
          ...goal,
          progress: goalProgress,
          completionRate: calculateCompletionRate(goal, goalProgress),
          streak: calculateStreak(goal, goalProgress),
          nextDue: calculateNextDueDate(goal, goalProgress),
        };
      },

      getActiveGoals: () => {
        const { goals, progress } = get();
        return goals
          .filter(goal => goal.status === 'active')
          .map(goal => {
            const goalProgress = progress.filter(p => p.goalId === goal.id);
            return {
              ...goal,
              progress: goalProgress,
              completionRate: calculateCompletionRate(goal, goalProgress),
              streak: calculateStreak(goal, goalProgress),
              nextDue: calculateNextDueDate(goal, goalProgress),
            };
          });
      },

      getGoalsByCategory: (category) => {
        const { goals, progress } = get();
        return goals
          .filter(goal => goal.category === category)
          .map(goal => {
            const goalProgress = progress.filter(p => p.goalId === goal.id);
            return {
              ...goal,
              progress: goalProgress,
              completionRate: calculateCompletionRate(goal, goalProgress),
              streak: calculateStreak(goal, goalProgress),
              nextDue: calculateNextDueDate(goal, goalProgress),
            };
          });
      },

      getDueGoals: (date = new Date()) => {
        const { goals, progress } = get();
        const targetDate = startOfDay(date);

        return goals
          .filter(goal => {
            if (goal.status !== 'active') return false;
            const nextDue = calculateNextDueDate(goal, progress);
            return nextDue && isSameDay(nextDue, targetDate);
          })
          .map(goal => {
            const goalProgress = progress.filter(p => p.goalId === goal.id);
            return {
              ...goal,
              progress: goalProgress,
              completionRate: calculateCompletionRate(goal, goalProgress),
              streak: calculateStreak(goal, goalProgress),
              nextDue: calculateNextDueDate(goal, goalProgress),
            };
          });
      },

      getCompletionRate: (goalId) => {
        const { goals, progress } = get();
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return 0;
        return calculateCompletionRate(goal, progress);
      },

      getStreak: (goalId) => {
        const { goals, progress } = get();
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return 0;
        return calculateStreak(goal, progress);
      },

      getNextDueDate: (goalId) => {
        const { goals, progress } = get();
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return null;
        return calculateNextDueDate(goal, progress);
      },

      updateGoalProgress: (id) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? updateGoalProgress(g) : g
          ),
        }));
      },
    }),
    {
      name: 'health-goals',
      version: 1,
    }
  )
); 