import { LenaConfig } from '../core/types';

const DEFAULT_CONFIG: LenaConfig = {
  notionApiKey: process.env.NOTION_API_KEY || '',
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',
  enableAutoSync: process.env.LENA_AUTO_SYNC === 'true',
  syncInterval: parseInt(process.env.LENA_SYNC_INTERVAL || '300000', 10), // 5 minutes default
  maxRetries: parseInt(process.env.LENA_MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.LENA_RETRY_DELAY || '5000', 10), // 5 seconds default
};

export function validateConfig(config: LenaConfig): void {
  if (!config.notionApiKey) {
    throw new Error('NOTION_API_KEY is required');
  }
  if (!config.notionDatabaseId) {
    throw new Error('NOTION_DATABASE_ID is required');
  }
  if (config.syncInterval < 30000) {
    throw new Error('LENA_SYNC_INTERVAL must be at least 30000ms (30 seconds)');
  }
  if (config.maxRetries < 1) {
    throw new Error('LENA_MAX_RETRIES must be at least 1');
  }
  if (config.retryDelay < 1000) {
    throw new Error('LENA_RETRY_DELAY must be at least 1000ms (1 second)');
  }
}

export function getConfig(): LenaConfig {
  const config = { ...DEFAULT_CONFIG };
  validateConfig(config);
  return config;
}
