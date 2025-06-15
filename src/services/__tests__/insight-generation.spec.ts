import { jest, describe, it, expect, beforeEach, afterEach  } from '@jest/globals';
import { InsightEngine } from '../InsightEngineClass';
import type { InsightContext, HealthPersona } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

describe('InsightEngine', () => {
  let insightEngine: InsightEngine;
  const mockApiKey = 'test-api-key';

  // Mock successful API response
  const mockSuccessResponse = {
    choices: [
      {
        message: {
          content: JSON.stringify({
            type: 'success',
            message: 'Test insight message',
            category: InsightCategory.PHYSICAL,
            relatedMetrics: ['steps', 'active_minutes'],
          }),
        },
      },
    ],
  };

  // Sample test persona
  const testPersona: HealthPersona = {
    id: 'test-persona',
    type: 'young_female',
    age: 35,
    gender: 'female',
    conditions: [],
    preferences: {
      activityLevel: 'active',
      dietaryRestrictions: [],
      sleepGoals: {
        bedtime: '23:00',
        wakeTime: '07:00',
        duration: 8,
      },
    },
    culturalContext: {
      country: 'TR',
      language: 'tr',
      timezone: 'Europe/Istanbul',
    },
  };

  beforeEach(() => {
    insightEngine = InsightEngine.getInstance({ type: 'openai', apiKey: mockApiKey });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateInsight', () => {
    it('generates insight successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await insightEngine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: { steps: 10000 },
      });

      expect(result).toMatchObject({
        type: 'success',
        category: InsightCategory.PHYSICAL,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles empty metrics gracefully', async () => {
      await expect(
        insightEngine.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: {},
        })
      ).rejects.toThrow('İçgörü oluşturulurken bir hata oluştu');
    });

    it('validates prompts when sanitization is enabled', async () => {
      await expect(
        insightEngine.generateInsight(
          {
            category: InsightCategory.PHYSICAL,
            metrics: { steps: 10000 },
          },
          { sanitizePrompt: true }
        )
      ).resolves.not.toThrow();

      // Test with invalid prompt content
      await expect(
        insightEngine.generateInsight(
          {
            category: '<script>alert("xss")</script>',
            metrics: { steps: 10000 },
          },
          { sanitizePrompt: true }
        )
      ).rejects.toThrow('Invalid prompt content');
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(
        insightEngine.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: { steps: 10000 },
        })
      ).rejects.toThrow('İçgörü oluşturulurken bir hata oluştu');
    });
  });

  describe('generateInsightForPersona', () => {
    const testContext: InsightContext = {
      persona: {
        id: 'test-user',
        type: 'young_female',
        age: 35,
        gender: 'female',
        conditions: [],
        preferences: {
          activityLevel: 'active',
          dietaryRestrictions: [],
          sleepGoals: {
            bedtime: '23:00',
            wakeTime: '07:00',
            duration: 8,
          },
        },
        culturalContext: {
          country: 'TR',
          language: 'tr',
          timezone: 'Europe/Istanbul',
        },
      },
      metrics: {
        steps: 8000,
        active_minutes: 45,
        sleep_duration: 7,
      },
    };

    it('generates persona-based insight successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await insightEngine.generateInsightForPersona(testContext);

      expect(result).toMatchObject({
        type: 'success',
        id: expect.stringContaining('persona-test-persona-'),
        date: expect.any(Date),
      });
    });

    it('includes persona context in API call', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await insightEngine.generateInsightForPersona(testContext);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(testPersona.age.toString()),
        })
      );
    });

    it('handles API timeout gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));

      await expect(insightEngine.generateInsightForPersona(testContext)).rejects.toThrow(
        'Kişiselleştirilmiş içgörü oluşturulurken bir hata oluştu'
      );
    });
  });
});
