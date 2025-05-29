export type HealthScoreTrend = 'up' | 'down' | 'stable';

export type HealthScoreRange = 'optimal' | 'moderate' | 'critical';

export interface HealthScoreData {
  score: number;
  range: HealthScoreRange;
  trend: HealthScoreTrend;
  date: string;
  previousScore?: number;
  change?: number;
}

export interface HealthScoreHistory {
  date: string;
  score: number;
  range: HealthScoreRange;
}

export interface HealthMetrics {
  currentScore: HealthScoreData;
  history: HealthScoreHistory[];
  targetScore: number;
  recommendations?: string[];
} 