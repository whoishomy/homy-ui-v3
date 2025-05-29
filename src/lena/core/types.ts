export interface LenaConfig {
  notionApiKey: string;
  notionDatabaseId: string;
  enableAutoSync: boolean;
  syncInterval: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
}

export interface LenaState {
  isConnected: boolean;
  lastSync: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  errorCount: number;
  notionPages: NotionPage[];
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  content?: string;
}

export interface SyncResult {
  success: boolean;
  timestamp: string;
  pagesProcessed: number;
  errors: Error[];
}

export interface LenaError extends Error {
  code: 'NOTION_API_ERROR' | 'SYNC_ERROR' | 'CONFIG_ERROR';
  details?: Record<string, unknown>;
}
