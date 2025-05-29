import type { ProviderConfig } from '@/services/providers/InsightProviderFactory';
import { InsightEngine } from '@/services/InsightEngineClass';

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const getAIConfig = (): ProviderConfig => {
  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai';
  const timeout = parseInt(process.env.AI_PROVIDER_TIMEOUT || '30000', 10);
  const cacheTTL = parseInt(process.env.AI_CACHE_TTL || '3600', 10);

  const config: ProviderConfig = {
    type: provider as 'openai' | 'anthropic',
    apiKey: getEnvVar(provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'),
    options: {
      cacheTTL,
      maxMetrics: 1000,
    },
  };

  return config;
};

export const initializeAIEngine = () => {
  const config = getAIConfig();
  return InsightEngine.getInstance(config);
};
