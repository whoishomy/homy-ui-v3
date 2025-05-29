import { HealthInsight, InsightContext, InsightCategory } from '@/types/analytics';
import { BaseInsightProvider } from './BaseInsightProvider';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { InsightCache, CacheKey } from '../cache/InsightCache';
import type { InsightTelemetry } from '../telemetry/InsightTelemetry';

export class OpenAIProvider extends BaseInsightProvider {
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly telemetry: InsightTelemetry;

  constructor(cache: InsightCache, telemetry: InsightTelemetry) {
    super(() => this.getApiKey(), cache);
    this.telemetry = telemetry;
  }

  protected async getApiKey(): Promise<string> {
    const config = await this.cache?.get({
      provider: 'openai',
      prompt: 'api-key',
      systemPrompt: 'configuration',
      options: { temperature: 0 },
    });
    if (!config?.message) {
      throw new Error('OpenAI API key not found in configuration');
    }
    return config.message;
  }

  public generateCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    const isPersonaContext = 'persona' in params;
    return {
      provider: 'openai',
      prompt: JSON.stringify(params),
      systemPrompt: isPersonaContext
        ? `Generate personalized insight for ${(params as InsightContext).persona.id}`
        : `Generate insight for ${(params as InsightGenerationParams).category}`,
      options: {
        temperature: 0.7,
        maxTokens: 500,
        sanitizePrompt: true,
      },
    };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    const cacheKey = this.generateCacheKey(params);
    const cachedInsight = await this.cache?.get(cacheKey);
    if (cachedInsight) {
      this.telemetry.recordMetric({
        timestamp: Date.now(),
        duration: 0,
        provider: 'openai',
        success: true,
        cacheHit: true,
        insightType: 'standard',
      });
      return cachedInsight;
    }

    const startTime = Date.now();
    const mergedOptions = this.mergeOptions(options);
    const prompt = this.generatePrompt(params);
    const apiKey = await this.getApiKey();

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(params),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: mergedOptions.maxTokens,
          temperature: mergedOptions.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const insight = this.processResponse(data, params);

      await this.cache?.set(cacheKey, insight);

      this.telemetry.recordMetric({
        timestamp: startTime,
        duration: Date.now() - startTime,
        provider: 'openai',
        success: true,
        cacheHit: false,
        insightType: 'standard',
      });

      return insight;
    } catch (error) {
      this.telemetry.recordError(error instanceof Error ? error : new Error('Unknown error'), {
        provider: 'openai',
        duration: Date.now() - startTime,
        insightType: 'standard',
      });
      throw error;
    }
  }

  async generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    const cacheKey = this.generateCacheKey(context);
    const cachedInsight = await this.cache?.get(cacheKey);
    if (cachedInsight) {
      this.telemetry.recordMetric({
        timestamp: Date.now(),
        duration: 0,
        provider: 'openai',
        success: true,
        cacheHit: true,
        insightType: 'persona',
      });
      return cachedInsight;
    }

    const startTime = Date.now();
    const mergedOptions = this.mergeOptions(options);
    const prompt = this.generatePersonaPrompt(context);
    const apiKey = await this.getApiKey();

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a health insights generator. Generate personalized health insights based on the following user profile:
              Age: ${context.persona.age}
              Gender: ${context.persona.gender}
              Conditions: ${context.persona.conditions.join(', ')}
              Activity Level: ${context.persona.preferences.activityLevel}
              Cultural Context: ${JSON.stringify(context.persona.culturalContext)}`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: mergedOptions.maxTokens,
          temperature: mergedOptions.temperature,
          timeout: mergedOptions.timeout,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const insight: HealthInsight = {
        id: `openai-persona-${context.persona.id}-${Date.now()}`,
        type: 'success',
        category: InsightCategory.PHYSICAL,
        message: data.choices[0].message.content,
        date: new Date(),
        relatedMetrics: Object.keys(context.metrics),
        source: 'openai',
      };

      await this.cache?.set(cacheKey, insight);

      this.telemetry.recordMetric({
        timestamp: startTime,
        duration: Date.now() - startTime,
        provider: 'openai',
        success: true,
        cacheHit: false,
        insightType: 'persona',
      });

      return insight;
    } catch (error) {
      this.telemetry.recordError(error instanceof Error ? error : new Error('Unknown error'), {
        provider: 'openai',
        duration: Date.now() - startTime,
        insightType: 'persona',
      });
      throw error;
    }
  }

  private generatePrompt(params: InsightGenerationParams): string {
    return `Generate a health insight for category: ${params.category}
Metrics: ${JSON.stringify(params.metrics, null, 2)}`;
  }

  private generatePersonaPrompt(context: InsightContext): string {
    return `Generate a personalized health insight based on the following metrics:
${JSON.stringify(context.metrics, null, 2)}`;
  }

  protected mergeOptions(options?: InsightGenerationOptions): Required<InsightGenerationOptions> {
    return {
      temperature: 0.7,
      maxTokens: 500,
      timeout: 30000,
      language: 'en',
      culturalContext: {},
      sanitizePrompt: true,
      ...options,
    };
  }

  protected processResponse(data: any, params: InsightGenerationParams): HealthInsight {
    return {
      id: `openai-${Date.now()}`,
      type: 'success',
      category: params.category as InsightCategory,
      message: data.choices[0].message.content,
      date: new Date(),
      relatedMetrics: Object.keys(params.metrics),
      source: 'openai',
    };
  }
}
