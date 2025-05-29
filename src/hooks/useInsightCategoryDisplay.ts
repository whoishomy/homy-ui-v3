import { InsightCategory } from '@/types/analytics';
import { useTranslation } from 'next-i18next';

export function useInsightCategoryDisplay() {
  const { t } = useTranslation('analytics');

  const getDisplay = (category: InsightCategory): string => {
    return t(`categories.${category}`);
  };

  const getOptions = () => {
    return Object.values(InsightCategory).map((category) => ({
      value: category,
      label: getDisplay(category),
    }));
  };

  return {
    getDisplay,
    getOptions,
  };
}
