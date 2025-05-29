import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  AnalyticsState,
  AnalyticsFilters,
  AnalyticsSummary,
  HealthInsight,
} from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

interface AnalyticsStore extends AnalyticsState {
  fetchSummary: (filters: AnalyticsFilters) => Promise<void>;
  fetchInsights: (filters: AnalyticsFilters) => Promise<void>;
  setFilters: (filters: AnalyticsFilters) => void;
  reset: () => void;
}

const initialState: AnalyticsState = {
  summary: null,
  insights: [],
  loading: false,
  error: null,
  filters: {
    timeRange: 'weekly',
    onlyActive: true,
    startDate: (() => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // Default to last 7 days
      return startDate;
    })(),
    endDate: new Date(),
  },
};

const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchSummary: async (filters: AnalyticsFilters) => {
        try {
          set({ loading: true, error: null });
          const summary = await analyticsService.getSummary(filters);
          set({ summary, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Veri yüklenirken bir hata oluştu',
            loading: false,
          });
        }
      },

      fetchInsights: async (filters: AnalyticsFilters) => {
        try {
          set({ loading: true, error: null });
          const insights = await analyticsService.getInsights(filters);
          set({ insights, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'İçgörüler yüklenirken bir hata oluştu',
            loading: false,
          });
        }
      },

      setFilters: (filters: AnalyticsFilters) => {
        set({ filters });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'analytics-store',
    }
  )
);

export { useAnalyticsStore };
export type { AnalyticsStore }; 