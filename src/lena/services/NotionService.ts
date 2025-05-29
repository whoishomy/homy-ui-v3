import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
  CreatePageResponse,
  UpdatePageResponse,
  QueryDatabaseResponse,
  DatabaseObjectResponse,
  PartialDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { NotionPage, LenaError } from '../core/types';

export class NotionService {
  private static instance: NotionService;
  private client: Client;
  private databaseId: string;

  private constructor(apiKey: string, databaseId: string) {
    this.client = new Client({ auth: apiKey });
    this.databaseId = databaseId;
  }

  public static getInstance(apiKey?: string, databaseId?: string): NotionService {
    if (!NotionService.instance) {
      if (!apiKey || !databaseId) {
        throw new Error('NotionService requires API key and database ID');
      }
      NotionService.instance = new NotionService(apiKey, databaseId);
    }
    return NotionService.instance;
  }

  private isFullPage(
    page:
      | PageObjectResponse
      | PartialPageObjectResponse
      | PartialDatabaseObjectResponse
      | DatabaseObjectResponse
  ): page is PageObjectResponse {
    return 'url' in page && page.object === 'page';
  }

  public async createPage(title: string, content: string, tags: string[]): Promise<NotionPage> {
    try {
      const response = (await this.client.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
          Tags: {
            multi_select: tags.map((tag) => ({ name: tag })),
          },
          Status: {
            select: {
              name: 'draft',
            },
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content,
                  },
                },
              ],
            },
          },
        ],
      })) as PageObjectResponse;

      return {
        id: response.id,
        title,
        url: response.url,
        lastModified: new Date().toISOString(),
        status: 'draft',
        tags,
        content,
      };
    } catch (error) {
      const notionError: LenaError = {
        name: 'LenaError',
        message: 'Failed to create Notion page',
        code: 'NOTION_API_ERROR',
        details: { error },
      } as LenaError;
      throw notionError;
    }
  }

  public async getPages(): Promise<NotionPage[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
      });

      return response.results.filter(this.isFullPage).map((page) => ({
        id: page.id,
        title:
          (page.properties.Name as { title: Array<{ plain_text: string }> }).title[0]?.plain_text ||
          'Untitled',
        url: page.url,
        lastModified: page.last_edited_time,
        status: ((page.properties.Status as { select: { name: string } })?.select?.name ||
          'draft') as 'draft' | 'published' | 'archived',
        tags: (
          (page.properties.Tags as { multi_select: Array<{ name: string }> })?.multi_select || []
        ).map((tag) => tag.name),
      }));
    } catch (error) {
      const notionError: LenaError = {
        name: 'LenaError',
        message: 'Failed to fetch Notion pages',
        code: 'NOTION_API_ERROR',
        details: { error },
      } as LenaError;
      throw notionError;
    }
  }

  public async updatePage(pageId: string, updates: Partial<NotionPage>): Promise<NotionPage> {
    try {
      const response = (await this.client.pages.update({
        page_id: pageId,
        properties: {
          ...(updates.title && {
            Name: {
              title: [{ text: { content: updates.title } }],
            },
          }),
          ...(updates.tags && {
            Tags: {
              multi_select: updates.tags.map((tag) => ({ name: tag })),
            },
          }),
          ...(updates.status && {
            Status: {
              select: { name: updates.status },
            },
          }),
        },
      })) as PageObjectResponse;

      return {
        id: response.id,
        title: updates.title || '',
        url: response.url,
        lastModified: new Date().toISOString(),
        status: (updates.status || 'draft') as 'draft' | 'published' | 'archived',
        tags: updates.tags || [],
        content: updates.content,
      };
    } catch (error) {
      const notionError: LenaError = {
        name: 'LenaError',
        message: 'Failed to update Notion page',
        code: 'NOTION_API_ERROR',
        details: { error },
      } as LenaError;
      throw notionError;
    }
  }
}
