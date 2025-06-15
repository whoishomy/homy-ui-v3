import { describe, it, expect  } from '@jest/globals';
import { InsightCategory } from '@/types/analytics';

describe('InsightCategory enum integrity', () => {
  it('covers all insight categories in test mocks', () => {
    const allCategories = Object.values(InsightCategory);
    const mockedCategories = [
      InsightCategory.PHYSICAL,
      InsightCategory.MENTAL,
      InsightCategory.NUTRITION,
      InsightCategory.SLEEP,
      InsightCategory.SOCIAL,
      InsightCategory.HEALTH,
    ];

    // Ensure all enum values are used in mocks
    expect(mockedCategories).toEqual(expect.arrayContaining(allCategories));

    // Ensure no extra categories are mocked
    expect(allCategories).toEqual(expect.arrayContaining(mockedCategories));
  });

  it('has consistent string values', () => {
    // Ensure enum values match their keys
    Object.entries(InsightCategory).forEach(([key, value]) => {
      expect(value).toBe(key);
    });
  });
});
