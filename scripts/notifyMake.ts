import axios from 'axios';

export type ComponentStatus = 'done' | 'in-progress' | 'failed';
export type ComponentType = 'ui' | 'test' | 'story' | 'theme';

export interface MakeNotificationPayload {
  file: string;
  component: string;
  status: ComponentStatus;
  type?: ComponentType;
  details?: {
    branch?: string;
    version?: string;
    environment?: string;
    error?: string;
  };
}

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/kk0p3yqvz5uzy39zpei08gu6hiqwpj7k';

// Usage examples:
/*
// UI Component Update
notifyMake({
  file: 'trademark-text-darkmode.png',
  component: 'TrademarkText',
  status: 'done',
  type: 'ui',
  details: {
    branch: 'feature/trademark-system',
  },
});

// Test Status
notifyMake({
  file: 'trademark-tests.log',
  component: 'TrademarkText',
  status: 'failed',
  type: 'test',
  details: {
    error: 'Dark mode styles not applied correctly',
  },
});

// Story Update
notifyMake({
  file: 'trademark-story-variants.png',
  component: 'TrademarkText',
  status: 'done',
  type: 'story',
});
*/

export const notifyMake =
  process.env.NODE_ENV === 'test'
    ? jest.fn().mockImplementation(() => Promise.resolve())
    : async (payload: MakeNotificationPayload): Promise<void> => {
        try {
          const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...payload,
              timestamp: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error(`Make webhook failed: ${response.statusText}`);
          }

          console.log('Make notification sent:', payload);
        } catch (error) {
          console.error('Failed to notify Make:', error);
          throw error;
        }
      };
