import type { HealthInsight } from '@/types/analytics';

export interface CacheKey {
  provider: string;
  prompt: string;
  systemPrompt: string;
  options: {
    temperature: number;
    [key: string]: unknown;
  };
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
  expired: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

export interface InsightCache {
  get(key: CacheKey): Promise<HealthInsight | null>;
  set(key: CacheKey, value: HealthInsight, ttl?: number): Promise<void>;
  delete(key: CacheKey): Promise<void>;
  clear(): Promise<void>;
  getStats(): CacheStats;
}

export abstract class BaseInsightCache implements InsightCache {
  protected readonly defaultTTL: number;
  protected stats: CacheStats = {
    size: 0,
    hits: 0,
    misses: 0,
    evictions: 0,
    expired: 0,
    oldestEntry: null,
    newestEntry: null,
  };

  constructor(defaultTTL: number = 3600) {
    this.defaultTTL = defaultTTL;
  }

  abstract get(key: CacheKey): Promise<HealthInsight | null>;
  abstract set(key: CacheKey, value: HealthInsight, ttl?: number): Promise<void>;
  abstract delete(key: CacheKey): Promise<void>;
  abstract clear(): Promise<void>;

  getStats(): CacheStats {
    return { ...this.stats };
  }

  protected recordHit(): void {
    this.stats.hits++;
  }

  protected recordMiss(): void {
    this.stats.misses++;
  }

  protected recordEviction(): void {
    this.stats.evictions++;
  }

  protected recordExpiration(): void {
    this.stats.expired++;
  }

  protected updateEntryTimestamps(timestamp: Date): void {
    if (!this.stats.oldestEntry || timestamp < this.stats.oldestEntry) {
      this.stats.oldestEntry = timestamp;
    }
    if (!this.stats.newestEntry || timestamp > this.stats.newestEntry) {
      this.stats.newestEntry = timestamp;
    }
  }
} 