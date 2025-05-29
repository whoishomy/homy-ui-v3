import type { HealthInsight, InsightContext, InsightCategory } from '@/types/analytics';
import type {
  AIInsightProvider,
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { InsightCache } from '../cache/InsightCache';
import type { CacheKey } from '../cache/InsightCache';

export abstract class BaseInsightProvider implements AIInsightProvider {
  private readonly _defaultOptions: InsightGenerationOptions = {
    maxTokens: 500,
    temperature: 0.7,
    sanitizePrompt: true,
  };

  constructor(
    private readonly _apiKeyProvider: () => Promise<string>,
    protected readonly cache?: InsightCache
  ) {}

  protected async getApiKey(): Promise<string> {
    try {
      const key = await this._apiKeyProvider();
      if (!key) {
        throw new Error('API key not available');
      }
      return key;
    } catch (error) {
      throw new Error('Failed to retrieve API key: ' + (error as Error).message);
    }
  }

  protected get defaultOptions(): InsightGenerationOptions {
    return { ...this._defaultOptions };
  }

  abstract generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;
  abstract generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight>;

  protected validatePrompt(prompt: string): boolean {
    if (!prompt || prompt.length < 10) return false;
    if (prompt.length > 4000) return false;
    if (/[<>{}`]/.test(prompt)) return false;
    return true;
  }

  protected sanitizePrompt(prompt: string): string {
    return prompt.replace(/[<>]/g, '').replace(/[{}]/g, '').replace(/`/g, '').trim();
  }

  protected getOptions(
    options?: Partial<InsightGenerationOptions>
  ): Required<InsightGenerationOptions> {
    return { ...this.defaultOptions, ...options } as Required<InsightGenerationOptions>;
  }

  protected validateAndSanitize(prompt: string, options?: InsightGenerationOptions): string {
    const mergedOptions = this.getOptions(options);

    if (mergedOptions.sanitizePrompt) {
      if (!this.validatePrompt(prompt)) {
        throw new Error('Invalid prompt content');
      }
      return this.sanitizePrompt(prompt);
    }

    return prompt;
  }

  public generateCacheKey(
    params: InsightGenerationParams | InsightContext,
    options?: Partial<InsightGenerationOptions>
  ): CacheKey {
    const mergedOptions = this.getOptions(options);
    const isInsightParams = 'category' in params;

    return {
      provider: this.constructor.name,
      prompt: JSON.stringify(params),
      systemPrompt: isInsightParams
        ? this.getSystemPrompt(params)
        : this.getPersonaSystemPrompt(params),
      options: {
        temperature: mergedOptions.temperature,
        maxTokens: mergedOptions.maxTokens,
        sanitizePrompt: mergedOptions.sanitizePrompt,
      },
    };
  }

  protected getPersonaSystemPrompt(context: InsightContext): string {
    return `Generate a personalized health insight for category: ${context.persona.id}`;
  }

  public getSystemPrompt(params: InsightGenerationParams): string {
    return `You are a health insights generator specialized in ${params.category}. 
    Generate personalized health insights based on user metrics while maintaining HIPAA compliance.
    Never include personally identifiable information in the response.`;
  }

  protected async getCachedInsight(key: CacheKey): Promise<HealthInsight | null> {
    if (!this.cache) return null;
    return await this.cache.get(key);
  }

  protected async setCachedInsight(
    key: CacheKey,
    value: HealthInsight,
    ttl?: number
  ): Promise<void> {
    if (!this.cache) return;
    await this.cache.set(key, value, ttl);
  }

  protected processResponse(data: any, params: InsightGenerationParams): HealthInsight {
    return {
      id: `${this.constructor.name.toLowerCase()}-${Date.now()}`,
      type: 'success',
      category: params.category as InsightCategory,
      message: this.sanitizeResponse(data.choices[0].message.content),
      date: new Date(),
      relatedMetrics: Object.keys(params.metrics),
    };
  }

  private sanitizeResponse(content: string): string {
    // Remove any potential PII patterns
    return content
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED-EMAIL]')
      .replace(/\b\d{10,16}\b/g, '[REDACTED-ID]');
  }
}
