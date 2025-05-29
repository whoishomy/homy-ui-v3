import { describe, it, expect, beforeEach } from 'vitest';
import { InsightProviderFactory, type ProviderConfig } from '../providers/InsightProviderFactory';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { AnthropicProvider } from '../providers/AnthropicProvider';
import { InMemoryInsightCache } from '../cache/InMemoryInsightCache';
import { InMemoryTelemetry } from '../telemetry/InMemoryTelemetry';

describe('InsightProviderFactory', () => {
  const testConfig: ProviderConfig = {
    type: 'openai',
    apiKey: 'test-api-key',
  };

  beforeEach(() => {
    InsightProviderFactory.clearProviders();
  });

  it('creates OpenAI provider with default dependencies', () => {
    const provider = InsightProviderFactory.createProvider(testConfig);
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('creates Anthropic provider with default dependencies', () => {
    const provider = InsightProviderFactory.createProvider({
      ...testConfig,
      type: 'anthropic',
    });
    expect(provider).toBeInstanceOf(AnthropicProvider);
  });

  it('throws error for unimplemented local provider', () => {
    expect(() => {
      InsightProviderFactory.createProvider({
        ...testConfig,
        type: 'local',
      });
    }).toThrow('Local provider not implemented yet');
  });

  it('reuses existing provider instances with same configuration', () => {
    const provider1 = InsightProviderFactory.createProvider(testConfig);
    const provider2 = InsightProviderFactory.createProvider(testConfig);
    expect(provider1).toBe(provider2);
  });

  it('creates separate instances for different API keys', () => {
    const provider1 = InsightProviderFactory.createProvider(testConfig);
    const provider2 = InsightProviderFactory.createProvider({
      ...testConfig,
      apiKey: 'different-key',
    });
    expect(provider1).not.toBe(provider2);
  });

  it('creates separate instances for different providers', () => {
    const openaiProvider = InsightProviderFactory.createProvider(testConfig);
    const anthropicProvider = InsightProviderFactory.createProvider({
      ...testConfig,
      type: 'anthropic',
    });
    expect(openaiProvider).not.toBe(anthropicProvider);
  });

  it('uses custom cache when provided', () => {
    const customCache = new InMemoryInsightCache(1800); // 30 minutes TTL
    const provider = InsightProviderFactory.createProvider({
      ...testConfig,
      cache: customCache,
    });
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('uses custom telemetry when provided', () => {
    const customTelemetry = new InMemoryTelemetry({ maxMetrics: 1000 });
    const provider = InsightProviderFactory.createProvider({
      ...testConfig,
      telemetry: customTelemetry,
    });
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('creates new instance when dependencies change', () => {
    const provider1 = InsightProviderFactory.createProvider(testConfig);
    const provider2 = InsightProviderFactory.createProvider({
      ...testConfig,
      cache: new InMemoryInsightCache(),
    });
    expect(provider1).not.toBe(provider2);
  });

  it('clears provider cache and resets default dependencies', () => {
    const provider1 = InsightProviderFactory.createProvider(testConfig);
    InsightProviderFactory.clearProviders();
    const provider2 = InsightProviderFactory.createProvider(testConfig);
    expect(provider1).not.toBe(provider2);
  });

  it('respects custom options for default dependencies', () => {
    const provider = InsightProviderFactory.createProvider({
      ...testConfig,
      options: {
        cacheTTL: 3600,
        maxMetrics: 5000,
      },
    });
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });
}); 