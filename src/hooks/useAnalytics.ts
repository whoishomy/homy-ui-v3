import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import type { TimelineEvent } from '@/types/timeline';

interface DailyStats {
  totalGoals: number;
  completedGoals: number;
  totalDuration: number;
  averageDuration: number;
  successRate: number;
}

interface WeeklyProgress {
  successRate: number;
  totalEvents: number;
  improvement: number;
}

interface CategoryDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

interface CompletionTrends {
  improvement: number;
  lastWeekRate: number;
  thisWeekRate: number;
}

export const useAnalytics = (events: TimelineEvent[]) => {
  const analytics = useMemo(() => {
    try {
      // Günlük istatistikler
      const todayEvents = events.filter(
        (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      );

      const dailyStats: DailyStats = {
        totalGoals: todayEvents.length,
        completedGoals: todayEvents.filter((e) => e.status === 'completed').length,
        totalDuration: todayEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0),
        averageDuration: todayEvents.length
          ? Math.round(
              todayEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0) / todayEvents.length
            )
          : 0,
        successRate: todayEvents.length
          ? Math.round(
              (todayEvents.filter((e) => e.status === 'completed').length / todayEvents.length) * 100
            )
          : 0,
      };

      // Haftalık ilerleme
      const last7Days = events.filter(
        (event) =>
          new Date(event.date) >= subDays(new Date(), 7) &&
          new Date(event.date) <= new Date()
      );

      const weeklyProgress: WeeklyProgress = {
        successRate: last7Days.length
          ? Math.round(
              (last7Days.filter((e) => e.status === 'completed').length / last7Days.length) * 100
            )
          : 0,
        totalEvents: last7Days.length,
        improvement: 0, // Hesaplanacak
      };

      // Kategori dağılımı
      const categoryDistribution: CategoryDistribution = events.reduce((acc, event) => {
        if (!acc[event.category]) {
          acc[event.category] = { count: 0, percentage: 0 };
        }
        acc[event.category].count++;
        return acc;
      }, {} as CategoryDistribution);

      // Yüzdeleri hesapla
      Object.values(categoryDistribution).forEach((category) => {
        category.percentage = Math.round((category.count / events.length) * 100);
      });

      // Tamamlanma trendleri
      const thisWeek = events.filter(
        (event) =>
          new Date(event.date) >= subDays(new Date(), 7) &&
          new Date(event.date) <= new Date()
      );

      const lastWeek = events.filter(
        (event) =>
          new Date(event.date) >= subDays(new Date(), 14) &&
          new Date(event.date) < subDays(new Date(), 7)
      );

      const thisWeekRate = thisWeek.length
        ? (thisWeek.filter((e) => e.status === 'completed').length / thisWeek.length) * 100
        : 0;

      const lastWeekRate = lastWeek.length
        ? (lastWeek.filter((e) => e.status === 'completed').length / lastWeek.length) * 100
        : 0;

      const completionTrends: CompletionTrends = {
        improvement: Math.round(thisWeekRate - lastWeekRate),
        lastWeekRate: Math.round(lastWeekRate),
        thisWeekRate: Math.round(thisWeekRate),
      };

      return {
        dailyStats,
        weeklyProgress,
        categoryDistribution,
        completionTrends,
        loading: false,
        error: null,
      };
    } catch (error) {
      return {
        dailyStats: {} as DailyStats,
        weeklyProgress: {} as WeeklyProgress,
        categoryDistribution: {} as CategoryDistribution,
        completionTrends: {} as CompletionTrends,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }, [events]);

  return analytics;
}; 