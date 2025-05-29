export interface Analytics {
  track(event: string, properties: any): void;
}

declare global {
  interface Window {
    analytics?: Analytics;
  }
}

export {};
