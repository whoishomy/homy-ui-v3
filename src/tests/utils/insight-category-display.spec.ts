import { describe, it, expect  } from '@jest/globals';
import { InsightCategory } from '@/types/analytics';
import {
  InsightCategoryDisplayMap,
  getInsightCategoryDisplay,
  getInsightCategoryOptions,
} from '@/utils/insightCategory';

describe('InsightCategory Display Utilities', () => {
  describe('InsightCategoryDisplayMap', () => {
    it('covers all InsightCategory enum values', () => {
      const mappedCategories = Object.keys(InsightCategoryDisplayMap);
      const enumValues = Object.values(InsightCategory);

      // Ensure all enum values have display mappings
      expect(mappedCategories.sort()).toEqual(enumValues.sort());
    });

    it('has valid Turkish display values', () => {
      Object.entries(InsightCategoryDisplayMap).forEach(([key, value]) => {
        expect(value).toBeTruthy();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getInsightCategoryDisplay', () => {
    it('returns correct display value for each category', () => {
      Object.values(InsightCategory).forEach((category) => {
        const display = getInsightCategoryDisplay(category);
        expect(display).toBe(InsightCategoryDisplayMap[category]);
      });
    });

    it('falls back to category value if mapping not found', () => {
      // @ts-expect-error Testing invalid category
      const display = getInsightCategoryDisplay('INVALID_CATEGORY');
      expect(display).toBe('INVALID_CATEGORY');
    });
  });

  describe('getInsightCategoryOptions', () => {
    it('returns array of value-label pairs for all categories', () => {
      const options = getInsightCategoryOptions();

      expect(options).toHaveLength(Object.keys(InsightCategory).length);

      options.forEach((option) => {
        expect(option).toEqual({
          value: expect.any(String),
          label: InsightCategoryDisplayMap[option.value],
        });
      });
    });

    it('maintains correct value-label mapping', () => {
      const options = getInsightCategoryOptions();

      options.forEach((option) => {
        expect(option.label).toBe(InsightCategoryDisplayMap[option.value]);
      });
    });
  });
});
