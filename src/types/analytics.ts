import { CarePlan } from './carePlan';

export enum HealthCategory {
  PHYSICAL = 'PHYSICAL',
  MENTAL = 'MENTAL',
  NUTRITION = 'NUTRITION',
  SLEEP = 'SLEEP',
  MEDICATION = 'MEDICATION',
  ACTIVITY = 'ACTIVITY',
}

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type HealthScore = {
  id: string;
  category: keyof typeof HealthCategory;
  score: number;
  date: Date;
  notes?: string;
};

export interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
  categories?: Array<keyof typeof HealthCategory>;
  timeRange: TimeRange;
  onlyActive?: boolean;
}

export interface TrendData {
  date: Date;
  value: number;
  category: keyof typeof HealthCategory;
  target?: number;
}

export interface CategoryDistribution {
  category: keyof typeof HealthCategory;
  count: number;
  successRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface InsightAction {
  type: 'suggestion';
  message: string;
  onComplete?: () => InsightAction | undefined;
}

export enum InsightCategory {
  PHYSICAL = 'PHYSICAL',
  SLEEP = 'SLEEP',
  NUTRITION = 'NUTRITION',
  MENTAL = 'MENTAL',
  VITALS = 'VITALS',
  HEALTH = 'HEALTH',
  MEDICATION = 'MEDICATION',
  EXERCISE = 'EXERCISE',
}

export type HealthGoalCategory =
  | InsightCategory.EXERCISE
  | InsightCategory.NUTRITION
  | InsightCategory.SLEEP
  | InsightCategory.MENTAL
  | InsightCategory.MEDICATION
  | InsightCategory.VITALS;

export interface HealthInsight {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: InsightCategory;
  message: string;
  date: Date;
  relatedMetrics: string[];
  action?: {
    type: 'suggestion' | 'action';
    message: string;
  };
  source?: string;
}

export type InsightType = 'success' | 'warning' | 'error' | 'info';

export interface AnalyticsSummary {
  trends: TrendData[];
  distribution: CategoryDistribution[];
  goalCompletion: {
    category: keyof typeof HealthCategory;
    completion: number;
    target: number;
  }[];
  adherence: {
    overall: number;
    byCategory: Record<keyof typeof HealthCategory, number>;
  };
}

export interface AnalyticsState {
  summary: AnalyticsSummary | null;
  insights: HealthInsight[];
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
}

// Analytics API Response
export type AnalyticsResponse = {
  summary: AnalyticsSummary;
  insights: HealthInsight[];
};

// Analytics Service Interface
export interface AnalyticsService {
  getSummary(filters: AnalyticsFilters): Promise<AnalyticsSummary>;
  getInsights(filters: AnalyticsFilters): Promise<HealthInsight[]>;
  generateReport(planId: string, format: 'pdf' | 'csv'): Promise<Blob>;
}

// Utility Types for Chart Components
export type ChartDataPoint = {
  date: Date;
  value: number;
  label?: string;
  category?: keyof typeof HealthCategory;
};

export type ChartSeries = {
  name: string;
  data: ChartDataPoint[];
  color?: string;
};

export type RadarDataPoint = {
  category: keyof typeof HealthCategory;
  value: number;
  target: number;
};

export type CalendarDataPoint = {
  date: Date;
  value: number;
  events: {
    type: 'medication' | 'goal' | 'metric';
    status: 'completed' | 'missed' | 'skipped';
    title: string;
  }[];
};

// Persona Types for Simulation Testing
export type HealthPersona = {
  id: string;
  type: 'young_female' | 'elderly_diabetic' | 'middle_aged_burnout';
  age: number;
  gender: 'male' | 'female' | 'other';
  conditions: string[];
  preferences: {
    activityLevel: 'sedentary' | 'moderate' | 'active';
    dietaryRestrictions?: string[];
    sleepGoals: {
      bedtime: string;
      wakeTime: string;
      duration: number;
    };
  };
  culturalContext: {
    country: string;
    language: string;
    timezone?: string;
    dietaryPreferences?: string[];
    religiousObservances?: string[];
  };
};

export interface InsightContext {
  persona: HealthPersona;
  metrics: Record<string, number>;
}

// Snapshot Testing Types
export type InsightSnapshot = {
  variant: 'success' | 'warning' | 'info';
  persona: HealthPersona['type'];
  language: HealthPersona['culturalContext']['language'];
  screenshot: string; // Base64 encoded image
  timestamp: Date;
  metadata: {
    viewport: {
      width: number;
      height: number;
    };
    theme: 'light' | 'dark';
    colorScheme: string;
  };
};

export type InsightOperation = 'generateInsight' | 'generateInsightForPersona';
