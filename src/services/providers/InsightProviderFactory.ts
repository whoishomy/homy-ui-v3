import type { AIInsightProvider } from '../interfaces/AIInsightProvider';
import type { InsightCache } from '../cache/InsightCache';
import type { InsightTelemetry } from '../telemetry/InsightTelemetry';
import { OpenAIProvider } from './OpenAIProvider';
import { AnthropicProvider } from './AnthropicProvider';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import { InMemoryTelemetry } from '../telemetry/InMemoryTelemetry';
import { InsightCategory } from '@/types/analytics';
import type { ProviderType } from './types';

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  cache?: InsightCache;
  telemetry?: InsightTelemetry;
  options?: {
    cacheTTL?: number;
    maxMetrics?: number;
  };
}

export class InsightProviderFactory {
  private static providers = new Map<string, AIInsightProvider>();
  private static defaultCache: InsightCache = new InMemoryInsightCache();
  private static defaultTelemetry: InsightTelemetry = new InMemoryTelemetry();

  static async createProvider(config: ProviderConfig): Promise<AIInsightProvider> {
    const cacheKey = this.generateProviderKey(config);

    if (this.providers.has(cacheKey)) {
      return this.providers.get(cacheKey)!;
    }

    const cache = config.cache ?? this.getOrCreateCache(config.options?.cacheTTL);
    const telemetry = config.telemetry ?? this.getOrCreateTelemetry(config.options?.maxMetrics);

    // Store API key in cache
    await cache.set(
      {
        provider: config.type,
        prompt: 'api-key',
        systemPrompt: 'configuration',
        options: { temperature: 0 },
      },
      {
        id: 'api-key',
        type: 'info',
        category: InsightCategory.HEALTH,
        message: config.apiKey,
        date: new Date(),
        relatedMetrics: [],
      }
    );

    let provider: AIInsightProvider;

    switch (config.type) {
      case 'openai':
        provider = new OpenAIProvider(cache, telemetry);
        break;
      case 'anthropic':
        provider = new AnthropicProvider(cache, telemetry);
        break;
      case 'local':
        throw new Error('Local provider not implemented yet');
      default:
        throw new Error(`Unknown provider type: ${config.type}`);
    }

    this.providers.set(cacheKey, provider);
    return provider;
  }

  private static generateProviderKey(config: ProviderConfig): string {
    return `${config.type}-${config.apiKey}-${config.cache?.constructor.name ?? 'default'}-${
      config.telemetry?.constructor.name ?? 'default'
    }`;
  }

  private static getOrCreateCache(ttl?: number): InsightCache {
    if (!this.defaultCache) {
      this.defaultCache = new InMemoryInsightCache(ttl);
    }
    return this.defaultCache;
  }

  private static getOrCreateTelemetry(maxMetrics?: number): InsightTelemetry {
    if (!this.defaultTelemetry) {
      this.defaultTelemetry = new InMemoryTelemetry({ maxMetrics });
    }
    return this.defaultTelemetry;
  }

  static clearProviders(): void {
    this.providers.clear();
    this.defaultCache = new InMemoryInsightCache();
    this.defaultTelemetry = new InMemoryTelemetry();
  }
}
