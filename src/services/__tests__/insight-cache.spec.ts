import { describe, it, expect, beforeEach, jest  } from '@jest/globals';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type { CacheKey } from '../cache/InsightCache';

describe('InMemoryInsightCache', () => {
  let cache: InMemoryInsightCache;
  const testTTL = 1; // 1 second TTL for testing

  const testInsight: HealthInsight = {
    id: 'test-1',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight',
    date: new Date(),
    relatedMetrics: ['steps'],
    action: {
      type: 'suggestion',
      message: 'View details'
    }
  };

  const testKey: CacheKey = {
    provider: 'openai',
    prompt: 'test prompt',
    systemPrompt: 'test system prompt',
    options: { temperature: 0.7 },
  };

  beforeEach(() => {
    jest.useFakeTimers();
    cache = new InMemoryInsightCache(testTTL);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stores and retrieves values', async () => {
    await cache.set(testKey, testInsight);
    const result = await cache.get(testKey);
    expect(result).toEqual(testInsight);
  });

  it('returns null for non-existent keys', async () => {
    const result = await cache.get({
      ...testKey,
      prompt: 'non-existent',
    });
    expect(result).toBeNull();
  });

  it('expires entries after TTL', async () => {
    await cache.set(testKey, testInsight);
    
    // Move time forward past TTL
    jest.advanceTimersByTime((testTTL + 1) * 1000);
    
    const result = await cache.get(testKey);
    expect(result).toBeNull();
  });

  it('deletes entries', async () => {
    await cache.set(testKey, testInsight);
    await cache.delete(testKey);
    const result = await cache.get(testKey);
    expect(result).toBeNull();
  });

  it('clears all entries', async () => {
    await cache.set(testKey, testInsight);
    await cache.set({ ...testKey, prompt: 'another' }, testInsight);
    
    await cache.clear();
    expect(cache.size).toBe(0);
  });

  it('generates different keys for different prompts', async () => {
    await cache.set(testKey, testInsight);
    await cache.set({ ...testKey, prompt: 'different' }, {
      ...testInsight,
      id: 'test-2',
    });

    const result1 = await cache.get(testKey);
    const result2 = await cache.get({ ...testKey, prompt: 'different' });

    expect(result1?.id).toBe('test-1');
    expect(result2?.id).toBe('test-2');
  });

  it('automatically cleans up expired entries', async () => {
    await cache.set(testKey, testInsight);
    await cache.set({ ...testKey, prompt: 'another' }, testInsight);

    // Move time forward past TTL
    jest.advanceTimersByTime((testTTL + 1) * 1000);

    // Trigger cleanup by adding a new entry
    await cache.set({ ...testKey, prompt: 'new' }, testInsight);

    const stats = cache.getStats();
    expect(stats.size).toBe(1);
    expect(stats.expired).toBe(2);
  });

  it('respects custom TTL over default', async () => {
    const customTTL = 5; // 5 seconds
    await cache.set(testKey, testInsight, customTTL);

    // Move time forward past default TTL but before custom TTL
    jest.advanceTimersByTime((testTTL + 1) * 1000);
    let result = await cache.get(testKey);
    expect(result).toEqual(testInsight);

    // Move time forward past custom TTL
    jest.advanceTimersByTime((customTTL - testTTL) * 1000);
    result = await cache.get(testKey);
    expect(result).toBeNull();
  });
}); 