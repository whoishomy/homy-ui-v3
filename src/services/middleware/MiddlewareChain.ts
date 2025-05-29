import type { HealthInsight, InsightContext } from '@/types/analytics';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { BaseInsightMiddleware, MiddlewareContext, NextFunction } from './InsightMiddleware';

export class MiddlewareChain {
  private middleware: BaseInsightMiddleware[] = [];

  addMiddleware(middleware: BaseInsightMiddleware): this {
    this.middleware.push(middleware);
    return this;
  }

  async executeGenerateInsight<T extends InsightGenerationParams | InsightContext>(
    params: T,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    operation: () => Promise<HealthInsight>
  ): Promise<HealthInsight> {
    let currentIndex = 0;

    const next: NextFunction<HealthInsight> = async () => {
      if (currentIndex >= this.middleware.length) {
        return operation();
      }

      const currentMiddleware = this.middleware[currentIndex++];
      if ('persona' in params) {
        // InsightContext case
        return currentMiddleware.generateInsightForPersona(
          params as InsightContext,
          options,
          context,
          next
        );
      } else {
        // InsightGenerationParams case
        return currentMiddleware.generateInsight(
          params as InsightGenerationParams,
          options,
          context,
          next
        );
      }
    };

    return next();
  }

  clear(): void {
    this.middleware = [];
  }
}
