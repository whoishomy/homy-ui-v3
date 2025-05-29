import { EventEmitter } from 'events';
import type { LenaConfig, LenaState, NotionPage, SyncResult, LenaError } from './types';
import { NotionService } from '../services/NotionService';

export class LenaEngine extends EventEmitter {
  private static instance: LenaEngine;
  private config: LenaConfig;
  private state: LenaState;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private notionService: NotionService;

  private constructor(config: LenaConfig) {
    super();
    this.config = config;
    this.state = {
      isConnected: false,
      lastSync: null,
      syncStatus: 'idle',
      errorCount: 0,
      notionPages: [],
    };
    this.notionService = NotionService.getInstance(config.notionApiKey, config.notionDatabaseId);
  }

  public static getInstance(config?: LenaConfig): LenaEngine {
    if (!LenaEngine.instance) {
      if (!config) {
        throw new Error('LenaEngine requires initial configuration');
      }
      LenaEngine.instance = new LenaEngine(config);
    }
    return LenaEngine.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.validateConfig();
      await this.connectToNotion();
      if (this.config.enableAutoSync) {
        this.startAutoSync();
      }
      this.emit('initialized');
    } catch (error) {
      const lenaError: LenaError = {
        name: 'LenaError',
        message: 'Failed to initialize LENA',
        code: 'CONFIG_ERROR',
        details: { error },
      } as LenaError;
      this.emit('error', lenaError);
      throw lenaError;
    }
  }

  private async validateConfig(): Promise<void> {
    if (!this.config.notionApiKey) {
      throw new Error('Notion API key is required');
    }
    if (!this.config.notionDatabaseId) {
      throw new Error('Notion database ID is required');
    }
  }

  private async connectToNotion(): Promise<void> {
    try {
      // Test connection by fetching pages
      await this.notionService.getPages();
      this.state.isConnected = true;
      this.emit('connected');
    } catch (error) {
      const lenaError: LenaError = {
        name: 'LenaError',
        message: 'Failed to connect to Notion',
        code: 'NOTION_API_ERROR',
        details: { error },
      } as LenaError;
      throw lenaError;
    }
  }

  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncInterval = setInterval(() => this.sync(), this.config.syncInterval);
  }

  public async sync(): Promise<SyncResult> {
    if (this.state.syncStatus === 'syncing') {
      throw new Error('Sync already in progress');
    }

    this.state.syncStatus = 'syncing';
    this.emit('syncStarted');

    try {
      const pages = await this.notionService.getPages();
      this.state.notionPages = pages;

      const result: SyncResult = {
        success: true,
        timestamp: new Date().toISOString(),
        pagesProcessed: pages.length,
        errors: [],
      };

      this.state.lastSync = result.timestamp;
      this.state.syncStatus = 'idle';
      this.emit('syncCompleted', result);

      return result;
    } catch (error) {
      this.state.syncStatus = 'error';
      this.state.errorCount++;

      const syncError: LenaError = {
        name: 'LenaError',
        message: 'Sync failed',
        code: 'SYNC_ERROR',
        details: { error },
      } as LenaError;

      this.emit('syncError', syncError);
      throw syncError;
    }
  }

  public getState(): LenaState {
    return { ...this.state };
  }

  public async createPage(
    title: string,
    content: string,
    tags: string[] = []
  ): Promise<NotionPage> {
    const page = await this.notionService.createPage(title, content, tags);
    this.state.notionPages.push(page);
    this.emit('pageCreated', page);
    return page;
  }

  public async updatePage(pageId: string, updates: Partial<NotionPage>): Promise<NotionPage> {
    const page = await this.notionService.updatePage(pageId, updates);
    const index = this.state.notionPages.findIndex((p) => p.id === pageId);
    if (index !== -1) {
      this.state.notionPages[index] = page;
    }
    this.emit('pageUpdated', page);
    return page;
  }

  public stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.state.isConnected = false;
    this.emit('stopped');
  }
}
