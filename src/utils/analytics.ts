'use client';

import type { Analytics } from '@/types/window';

export type AnalyticsEventPayload = Record<string, any>;

export type AnalyticsEvent = {
  name: string;
  payload: AnalyticsEventPayload;
  timestamp?: number;
};

/**
 * Tracks an analytics event with the given name and payload.
 * Handles different environments (dev/test/prod) appropriately.
 */
export function trackAnalyticsEvent(eventName: string, payload: AnalyticsEventPayload): void {
  try {
    if (typeof window === 'undefined') return; // SSR güvenliği

    const isTest = process.env.NODE_ENV === 'test';
    const isDev = process.env.NODE_ENV === 'development';

    // Test ortamında mock tracking
    if (isTest) return;

    // Development ortamında console debug
    if (isDev) {
      console.debug(
        '[Analytics Event]',
        {
          name: eventName,
          payload,
          timestamp: Date.now(),
        },
        '\n',
        JSON.stringify(payload, null, 2)
      );
    }

    // Production tracking
    window.analytics?.track?.(eventName, {
      ...payload,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.warn('[Analytics Error]:', error);
  }
}

/**
 * Gets the analytics instance based on the current environment.
 * Primarily used for testing and development.
 */
export function getAnalytics(): Analytics {
  if (typeof window === 'undefined') {
    return {
      track: () => {},
    };
  }

  const isTest = process.env.NODE_ENV === 'test';
  const isDev = process.env.NODE_ENV === 'development';

  if (isTest) {
    return {
      track: () => {},
    };
  }

  if (isDev) {
    return {
      track: (event: string, properties: any) => {
        console.debug('[Analytics Event]:', event, properties);
      },
    };
  }

  return (
    (window.analytics as Analytics) || {
      track: () => console.warn('[Analytics] No analytics provider found'),
    }
  );
}

export const logInsightInteraction = (event: string, properties: any) => {
  try {
    getAnalytics().track(event, properties);
  } catch (error) {
    console.error('[Analytics Error]:', error);
  }
};
