import 'next-i18next';
import type { InsightCategory } from '@/types/analytics';

declare module 'next-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      analytics: {
        categories: Record<InsightCategory, string>;
        insights: {
          priority: string;
          title: string;
          tooltips: {
            default: string;
          };
        };
      };
      common: {
        close: string;
        loading: string;
        error: string;
        success: string;
        warning: string;
      };
    };
  }
}
