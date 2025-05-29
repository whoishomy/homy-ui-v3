import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { userEvent } from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InsightCard } from '@/components/analytics/components';
import { InsightEngine } from '@/services/InsightEngineClass';
import { analyticsService } from '@/services/analyticsService';
import {
  InsightCategory,
  type HealthInsight,
  type HealthPersona,
  type InsightContext,
} from '@/types/analytics';

expect.extend(toHaveNoViolations);

// Mock i18next
const mockT = vi.fn((key: string, options?: { defaultValue: string }) => {
  if (key === 'direction') return 'ltr';
  return options?.defaultValue || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock analytics service
vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    track: vi.fn(),
  },
}));

// Test Personas
const TEST_PERSONAS: Record<string, HealthPersona> = {
  young_female: {
    id: 'p1',
    type: 'young_female',
    age: 25,
    gender: 'female',
    conditions: [],
    preferences: {
      activityLevel: 'active',
      dietaryRestrictions: ['vegetarian'],
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
      dietaryPreferences: ['vegetarian'],
      religiousObservances: [],
    },
  },
  elderly_diabetic: {
    id: 'p2',
    type: 'elderly_diabetic',
    age: 65,
    gender: 'male',
    conditions: ['type-2-diabetes', 'hypertension'],
    preferences: {
      activityLevel: 'moderate',
      dietaryRestrictions: ['low-sugar', 'low-sodium'],
      sleepGoals: {
        bedtime: '21:00',
        wakeTime: '06:00',
        duration: 9,
      },
    },
    culturalContext: {
      country: 'TR',
      language: 'tr',
      timezone: 'Europe/Istanbul',
      dietaryPreferences: ['low-sugar', 'low-sodium'],
      religiousObservances: ['ramadan'],
    },
  },
  middle_aged_burnout: {
    id: 'p3',
    type: 'middle_aged_burnout',
    age: 42,
    gender: 'female',
    conditions: ['anxiety', 'insomnia'],
    preferences: {
      activityLevel: 'sedentary',
      sleepGoals: {
        bedtime: '00:00',
        wakeTime: '07:00',
        duration: 7,
      },
    },
    culturalContext: {
      country: 'TR',
      language: 'tr',
      timezone: 'Europe/Istanbul',
      dietaryPreferences: [],
      religiousObservances: [],
    },
  },
};

// Test Contexts
const createTestContext = (persona: HealthPersona): InsightContext => ({
  persona,
  metrics: {
    steps: 8000,
    active_minutes: 45,
    sleep_duration: 7,
    sleep_quality: 85,
    heart_rate: 72,
    stress_level: 35,
  },
});

// Mock OpenAI API responses
const mockLLMResponses = {
  success: {
    role: 'assistant',
    content: JSON.stringify({
      id: 'test-success',
      type: 'success',
      category: InsightCategory.PHYSICAL,
      message: 'Egzersiz hedeflerinizi tutarlı şekilde gerçekleştiriyorsunuz',
      date: new Date(),
      relatedMetrics: ['Adım Sayısı', 'Aktif Dakika'],
      action: {
        type: 'suggestion',
        message: 'Detaylı istatistikleri görüntüle',
      },
    } as HealthInsight),
  },
  warning: {
    role: 'assistant',
    content: JSON.stringify({
      id: 'test-warning',
      type: 'warning',
      category: InsightCategory.SLEEP,
      message: 'Son 3 gündür uyku düzeninizde bozulma var',
      date: new Date(),
      relatedMetrics: ['Uyku Süresi', 'Uyku Kalitesi'],
      action: {
        type: 'suggestion',
        message: 'Uyku düzeni önerilerini gör',
      },
    } as HealthInsight),
  },
  error: {
    role: 'assistant',
    content: JSON.stringify({
      id: 'test-error',
      type: 'error',
      category: InsightCategory.NUTRITION,
      message: 'Beslenme alışkanlıklarınızda önemli eksiklikler var',
      date: new Date(),
      relatedMetrics: ['Kalori Alımı', 'Besin Çeşitliliği'],
      action: {
        type: 'suggestion',
        message: 'Beslenme önerilerini görüntüle',
      },
    } as HealthInsight),
  },
};

// Mock fetch for API calls
global.fetch = vi.fn();

describe('InsightEngine Integration', () => {
  const mockApiKey = 'test-api-key';
  let insightEngine: InsightEngine;
  let mockInsights: HealthInsight[];

  beforeEach(() => {
    vi.clearAllMocks();
    insightEngine = InsightEngine.getInstance({ type: 'openai', apiKey: mockApiKey });
    mockInsights = [];

    // Reset i18n mock to LTR
    mockT.mockImplementation((key: string, options?: { defaultValue: string }) => {
      if (key === 'direction') return 'ltr';
      return options?.defaultValue || key;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Insight Provider Integration', () => {
    it('generates insights using LLM', async () => {
      // Mock successful LLM response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLLMResponses.success,
      });

      const result = await insightEngine.generateInsight({
        category: InsightCategory.PHYSICAL,
        metrics: {
          steps: 8000,
          activeMinutes: 45,
        },
      });

      expect(result).toMatchObject({
        type: 'success',
        category: InsightCategory.PHYSICAL,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/chat/completions'),
        expect.any(Object)
      );
    });

    it('handles LLM timeout gracefully', async () => {
      // Mock timeout
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));

      await expect(
        insightEngine.generateInsight({
          category: InsightCategory.PHYSICAL,
          metrics: { steps: 8000 },
        })
      ).rejects.toThrow('İçgörü oluşturulurken bir hata oluştu');
    });
  });

  describe('InsightCard Lifecycle', () => {
    const mockInsight: HealthInsight = {
      id: 'test-1',
      type: 'success',
      category: InsightCategory.PHYSICAL,
      message: 'Test insight message',
      date: new Date(),
      relatedMetrics: ['Test Metric'],
      action: {
        type: 'suggestion',
        message: 'Test action',
      },
    };

    it('tracks view event on mount', async () => {
      render(<InsightCard insight={mockInsight} onDismiss={() => {}} />);

      await waitFor(() => {
        expect(analyticsService.track).toHaveBeenCalledWith('insight_viewed', {
          insightId: mockInsight.id,
          type: mockInsight.type,
          category: mockInsight.category,
        });
      });
    });

    it('prevents re-mount after dismiss', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<InsightCard insight={mockInsight} onDismiss={() => {}} />);

      const dismissButton = screen.getByRole('button', { name: /kapat/i });
      await user.click(dismissButton);

      rerender(<InsightCard insight={mockInsight} onDismiss={() => {}} />);
      expect(analyticsService.track).toHaveBeenCalledTimes(2); // Initial view + dismiss
    });
  });

  describe('Edge Cases', () => {
    it('handles empty insight list gracefully', async () => {
      const { container } = render(
        <div data-testid="insights-container">
          {mockInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onDismiss={() => {}} />
          ))}
        </div>
      );

      expect(screen.queryByTestId('insights-container')).toBeEmptyDOMElement();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility in RTL mode', async () => {
      // Override i18n mock for RTL
      mockT.mockImplementation((key: string, options?: { defaultValue: string }) => {
        if (key === 'direction') return 'rtl';
        return options?.defaultValue || key;
      });

      const insight = JSON.parse(mockLLMResponses.success.content);
      const { container } = render(
        <InsightCard
          insight={{ ...insight, id: 'test-rtl', date: new Date() }}
          onDismiss={() => {}}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(container.firstChild).toHaveAttribute('dir', 'rtl');
    });

    it('supports keyboard-only navigation', async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();

      render(
        <div>
          {[mockLLMResponses.success, mockLLMResponses.warning].map((response, index) => {
            const insight: HealthInsight = JSON.parse(response.content);
            return (
              <InsightCard
                key={index}
                insight={{ ...insight, id: `test-${index}`, date: new Date() }}
                onDismiss={() => {}}
                onAction={mockAction}
              />
            );
          })}
        </div>
      );

      // Tab through all interactive elements
      await user.tab();
      expect(screen.getByText('Detaylı istatistikleri görüntüle')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/içgörüyü kapat/i)).toHaveFocus();

      // Trigger action with Enter
      await user.keyboard('{Enter}');
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('Sentiment Analysis', () => {
    it('maintains appropriate emotional tone', async () => {
      const warningInsight = JSON.parse(mockLLMResponses.warning.content);
      render(
        <InsightCard
          insight={{ ...warningInsight, id: 'test-warning', date: new Date() }}
          onDismiss={() => {}}
        />
      );

      // Warning mesajları kırmızı olmamalı (agresif değil)
      const warningIcon = screen.getByTestId('insight-icon-warning');
      const styles = window.getComputedStyle(warningIcon);
      expect(styles.color).toBe('rgb(234, 179, 8)'); // text-yellow-500

      // Mesaj metni nötr renkte olmalı
      const message = screen.getByText(warningInsight.message);
      const messageStyles = window.getComputedStyle(message);
      expect(messageStyles.color).toBe('rgb(17, 24, 39)'); // text-gray-900
    });
  });

  describe('Persona-based Insights', () => {
    Object.entries(TEST_PERSONAS).forEach(([personaType, persona]) => {
      describe(`${personaType} persona`, () => {
        const context = createTestContext(persona);

        it('generates appropriate tone and content', async () => {
          // Mock LLM response based on persona
          const personaPrompt = `
            User Profile:
            - Age: ${persona.age}
            - Health Conditions: ${persona.conditions.join(', ')}
            - Activity Level: ${persona.preferences.activityLevel}
            - Dietary Restrictions: ${persona.preferences.dietaryRestrictions?.join(', ')}
            
            Generate health insight for their metrics:
            ${JSON.stringify(context.metrics, null, 2)}
          `;

          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              role: 'assistant',
              content: JSON.stringify({
                type: 'info',
                message: `Customized message for ${personaType}`,
                category: InsightCategory.PHYSICAL,
                relatedMetrics: ['Steps', 'Active Minutes'],
              }),
            }),
          });

          const insight = await insightEngine.generateInsightForPersona(context);

          // Render and verify
          const { container } = render(<InsightCard insight={insight} onDismiss={() => {}} />);

          // Take snapshot
          expect(container).toMatchSnapshot(`insight-${personaType}`);

          // Verify persona-specific considerations
          if (persona.conditions.includes('type-2-diabetes')) {
            expect(screen.getByText(/customized message/i)).toHaveTextContent(/blood sugar/i);
          }

          if (persona.preferences.activityLevel === 'sedentary') {
            expect(screen.getByText(/customized message/i)).toHaveTextContent(
              /gradually increase/i
            );
          }

          // Verify cultural sensitivity
          if (persona.culturalContext.religiousObservances?.includes('ramadan')) {
            expect(screen.getByText(/customized message/i)).not.toHaveTextContent(/meal timing/i);
          }
        });

        it('adapts to cultural context', async () => {
          const { language } = persona.culturalContext;

          // Override i18n mock for persona's language
          mockT.mockImplementation((key: string, options?: { defaultValue: string }) => {
            if (key === 'direction') return ['ar', 'he'].includes(language) ? 'rtl' : 'ltr';
            // Add more translations as needed
            return options?.defaultValue || key;
          });

          const insight = await insightEngine.generateInsightForPersona(context);
          const { container } = render(<InsightCard insight={insight} onDismiss={() => {}} />);

          if (['ar', 'he'].includes(language)) {
            expect(container.firstChild).toHaveAttribute('dir', 'rtl');
          }

          // Take snapshot for each language variant
          expect(container).toMatchSnapshot(`insight-${personaType}-${language}`);
        });
      });
    });
  });

  describe('Visual Regression', () => {
    const variants = ['success', 'warning', 'error'] as const;
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    variants.forEach((variant) => {
      viewports.forEach((viewport) => {
        it(`matches ${variant} snapshot on ${viewport.name}`, async () => {
          // Set viewport
          Object.defineProperty(window, 'innerWidth', { value: viewport.width });
          Object.defineProperty(window, 'innerHeight', { value: viewport.height });

          const insight: HealthInsight = {
            id: `test-${variant}`,
            type: variant,
            category: InsightCategory.PHYSICAL,
            message: `Test ${variant} message`,
            date: new Date(),
            relatedMetrics: ['Test Metric'],
            action: {
              type: 'suggestion',
              message: 'Test action',
            },
          };

          const { container } = render(<InsightCard insight={insight} onDismiss={() => {}} />);

          // Take snapshot with viewport metadata
          expect(container).toMatchSnapshot(`insight-${variant}-${viewport.name}`);
        });
      });
    });

    // Theme variations
    ['light', 'dark'].forEach((theme) => {
      it(`matches snapshot in ${theme} theme`, async () => {
        document.documentElement.classList.toggle('dark', theme === 'dark');

        const insight: HealthInsight = {
          id: 'test-theme',
          type: 'success',
          category: InsightCategory.PHYSICAL,
          message: 'Test theme message',
          date: new Date(),
          relatedMetrics: ['Test Metric'],
          action: {
            type: 'suggestion',
            message: 'Test action',
          },
        };

        const { container } = render(<InsightCard insight={insight} onDismiss={() => {}} />);

        expect(container).toMatchSnapshot(`insight-theme-${theme}`);
      });
    });
  });
});
