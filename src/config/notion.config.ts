import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const databaseId = process.env.NOTION_DATABASE_ID;

export interface ComponentMetadata {
  name: string;
  description: string;
  tags: string[];
  screenshotCount: number;
  lastUpdated: string;
}

export const createComponentPage = async (metadata: ComponentMetadata) => {
  if (!databaseId) throw new Error('Notion database ID not found');

  return await notionClient.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Component: {
        title: [{ text: { content: metadata.name } }],
      },
      Description: {
        rich_text: [{ text: { content: metadata.description } }],
      },
      Tags: {
        multi_select: metadata.tags.map((tag) => ({ name: tag })),
      },
      'Screenshot Count': {
        number: metadata.screenshotCount,
      },
      'Last Updated': {
        date: { start: metadata.lastUpdated },
      },
    },
  });
};

export const updateComponentPage = async (pageId: string, metadata: Partial<ComponentMetadata>) => {
  const properties: any = {};

  if (metadata.description) {
    properties.Description = {
      rich_text: [{ text: { content: metadata.description } }],
    };
  }

  if (metadata.tags) {
    properties.Tags = {
      multi_select: metadata.tags.map((tag) => ({ name: tag })),
    };
  }

  if (metadata.screenshotCount !== undefined) {
    properties['Screenshot Count'] = {
      number: metadata.screenshotCount,
    };
  }

  if (metadata.lastUpdated) {
    properties['Last Updated'] = {
      date: { start: metadata.lastUpdated },
    };
  }

  return await notionClient.pages.update({
    page_id: pageId,
    properties,
  });
};
