import type { HealthInsight } from '@/types/analytics';
import { BaseInsightCache, type CacheKey } from './InsightCache';

interface CacheEntry {
  value: HealthInsight;
  expiresAt: number;
  createdAt: Date;
}

export class InMemoryInsightCache extends BaseInsightCache {
  private readonly cache: Map<string, CacheEntry> = new Map();
  private readonly cleanupInterval: NodeJS.Timeout;

  constructor(defaultTTL: number = 3600, cleanupIntervalMs: number = 60000) {
    super(defaultTTL);
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  async get(key: CacheKey): Promise<HealthInsight | null> {
    const serializedKey = this.serializeKey(key);
    const entry = this.cache.get(serializedKey);
    if (!entry) {
      this.recordMiss();
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(serializedKey);
      this.recordExpiration();
      this.recordMiss();
      this.stats.size--;
      return null;
    }

    this.recordHit();
    return entry.value;
  }

  async set(key: CacheKey, value: HealthInsight, ttl: number = this.defaultTTL): Promise<void> {
    const serializedKey = this.serializeKey(key);
    const now = new Date();
    const entry: CacheEntry = {
      value,
      expiresAt: Date.now() + ttl * 1000,
      createdAt: now,
    };

    if (!this.cache.has(serializedKey)) {
      this.stats.size++;
    }

    this.cache.set(serializedKey, entry);
    this.updateEntryTimestamps(now);
  }

  async delete(key: CacheKey): Promise<void> {
    const serializedKey = this.serializeKey(key);
    if (this.cache.delete(serializedKey)) {
      this.stats.size--;
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.oldestEntry = null;
    this.stats.newestEntry = null;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.recordExpiration();
        this.stats.size--;
      }
    }
  }

  private serializeKey(key: CacheKey): string {
    return JSON.stringify(key);
  }

  dispose(): void {
    clearInterval(this.cleanupInterval);
  }

  get size(): number {
    return this.stats.size;
  }
} 