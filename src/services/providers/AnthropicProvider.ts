import type { HealthInsight, InsightContext, InsightCategory } from '@/types/analytics';
import { BaseInsightProvider } from '../interfaces/AIInsightProvider';
import type {
  InsightGenerationParams,
  InsightGenerationOptions,
} from '../interfaces/AIInsightProvider';
import type { InsightCache, CacheKey } from '../cache/InsightCache';
import type { InsightTelemetry } from '../telemetry/InsightTelemetry';

export class AnthropicProvider extends BaseInsightProvider {
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(cache: InsightCache, telemetry: InsightTelemetry) {
    super(cache, telemetry);
  }

  async generateInsight(
    params: InsightGenerationParams,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    const cacheKey = this.generateCacheKey(params);
    const cachedInsight = await this.cache?.get(cacheKey);
    if (cachedInsight) {
      return cachedInsight;
    }

    const mergedOptions = this.mergeOptions(options);
    const prompt = this.generatePrompt(params);
    const apiKey = await this.getApiKey();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2024-03-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
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
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const insight = this.processResponse(data, params);

    await this.cache?.set(cacheKey, insight);
    return insight;
  }

  async generateInsightForPersona(
    context: InsightContext,
    options?: InsightGenerationOptions
  ): Promise<HealthInsight> {
    const cacheKey = this.generateCacheKey(context);
    const cachedInsight = await this.cache.get(cacheKey);
    if (cachedInsight) {
      return this.withTelemetry(async () => cachedInsight, {
        provider: 'anthropic',
        cacheHit: true,
        insightType: 'persona',
      });
    }

    const mergedOptions = this.mergeOptions(options);
    const prompt = this.generatePersonaPrompt(context);

    return this.withTelemetry(
      async () => {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
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
          throw new Error(`Anthropic API error: ${response.statusText}`);
        }

        const data = await response.json();
        const insight: HealthInsight = {
          id: `anthropic-persona-${context.persona.id}-${Date.now()}`,
          type: 'success',
          category: InsightCategory.PHYSICAL,
          message: data.content[0].text,
          date: new Date(),
          relatedMetrics: Object.keys(context.metrics),
          source: 'anthropic',
          personaId: context.persona.id,
        };

        await this.cache.set(cacheKey, insight);
        return insight;
      },
      {
        provider: 'anthropic',
        cacheHit: false,
        insightType: 'persona',
      }
    );
  }

  private generatePrompt(params: InsightGenerationParams): string {
    return `Generate a health insight for category: ${params.category}
Metrics: ${JSON.stringify(params.metrics, null, 2)}`;
  }

  private generatePersonaPrompt(context: InsightContext): string {
    return `Generate a personalized health insight based on the following metrics:
${JSON.stringify(context.metrics, null, 2)}`;
  }

  public generateCacheKey(params: InsightGenerationParams | InsightContext): CacheKey {
    const isPersonaContext = 'persona' in params;
    return {
      provider: 'anthropic',
      prompt: JSON.stringify(params),
      systemPrompt: isPersonaContext
        ? `Generate personalized insight for ${(params as InsightContext).persona.id}`
        : `Generate insight for ${(params as InsightGenerationParams).category}`,
      options: {
        temperature: 0.7,
      },
    };
  }

  private async generateInsight(context: InsightContext): Promise<HealthInsight> {
    return {
      id: 'generated-insight',
      category: InsightCategory.PHYSICAL,
      title: 'Generated Insight',
      description: 'This is a generated insight',
      priority: 'high',
      type: 'warning',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        personaId: context.persona.id,
        source: 'anthropic',
      },
    };
  }
}
