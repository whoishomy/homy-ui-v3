export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenMaxAttempts: number;
}

export interface ProviderConfig {
  openAIKey: string;
  anthropicKey: string;
  cacheTTL: number;
  maxMetrics: number;
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
}

export type InsightCategory = 'PHYSICAL' | 'HEALTH' | 'SLEEP' | 'NUTRITION';

export interface InsightRequest {
  category: InsightCategory;
  metrics: Record<string, number>;
}

export interface PersonaInsightRequest extends InsightRequest {
  persona: {
    id: string;
    age: number;
    gender: string;
    conditions: string[];
    preferences: {
      activityLevel: string;
    };
    culturalContext: {
      country: string;
      language: string;
    };
  };
}

export interface ProviderComparison {
  costComparison: {
    openai: number;
    anthropic: number;
  };
  performanceComparison: {
    openai: {
      avgLatency: number;
      successRate: number;
    };
    anthropic: {
      avgLatency: number;
      successRate: number;
    };
  };
}

export interface UsagePatterns {
  popularCategories: InsightCategory[];
  timeDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
} 