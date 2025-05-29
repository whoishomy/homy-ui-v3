import { InsightCategory } from '@/types/analytics';

export const InsightCategoryDisplayMap: Record<InsightCategory, string> = {
  [InsightCategory.PHYSICAL]: 'Fiziksel Aktivite',
  [InsightCategory.MENTAL]: 'Zihinsel Sağlık',
  [InsightCategory.NUTRITION]: 'Beslenme',
  [InsightCategory.SLEEP]: 'Uyku',
  [InsightCategory.SOCIAL]: 'Sosyal Etkileşim',
  [InsightCategory.HEALTH]: 'Genel Sağlık',
};

export const getInsightCategoryDisplay = (category: InsightCategory): string => {
  return InsightCategoryDisplayMap[category] || category;
};

export const getInsightCategoryOptions = () => {
  return Object.entries(InsightCategoryDisplayMap).map(([value, label]) => ({
    value: value as InsightCategory,
    label,
  }));
};
