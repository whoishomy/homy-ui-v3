import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';

export const createMockInsight = (
  id: string,
  type: 'success' | 'warning' | 'error' = 'success',
  category: InsightCategory = InsightCategory.PHYSICAL,
  withPersona = false
): HealthInsight => ({
  id,
  type,
  category,
  message: `Test message ${id}`,
  date: new Date('2024-05-25T13:49:11.487Z'),
  relatedMetrics: ['Steps', 'Distance'],
  action: {
    type: 'suggestion',
    message: 'View details',
  },
  ...(withPersona && {
    personaId: 'test-persona',
    source: 'persona-based',
  }),
});

export const mockInsightsList = [
  createMockInsight('1', 'success', InsightCategory.PHYSICAL),
  createMockInsight('2', 'warning', InsightCategory.NUTRITION),
  createMockInsight('3', 'error', InsightCategory.SLEEP),
  createMockInsight('4', 'success', InsightCategory.MENTAL, true), // with persona
];
