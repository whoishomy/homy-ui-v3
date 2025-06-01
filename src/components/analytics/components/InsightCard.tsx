import React from 'react';
import { useTranslation } from 'react-i18next';
import { HealthInsight } from '@/types/analytics';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { getInsightCategoryDisplay } from '@/utils/insightCategory';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: HealthInsight;
  onDismiss: (id: string) => void;
  onAction?: () => void;
  'data-testid'?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onDismiss,
  onAction,
  'data-testid': testId,
}) => {
  const { t } = useTranslation();

  const getIconForType = (type: HealthInsight['type']) => {
    switch (type) {
      case 'success':
        return { icon: '✓', color: 'text-green-500' };
      case 'warning':
        return { icon: '⚠', color: 'text-yellow-500' };
      case 'error':
        return { icon: '⚠', color: 'text-red-500' };
      default:
        return { icon: 'ℹ', color: 'text-blue-500' };
    }
  };

  const { icon, color } = getIconForType(insight.type);

  return (
    <article
      role="article"
      aria-label={insight.message}
      dir={t('direction')}
      className="relative bg-white rounded-lg shadow-lg p-4 mb-4"
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span
            data-testid={`insight-icon-${insight.type}`}
            className={`text-xl p-2 rounded-full mr-3 ${color}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div>
            <p className="text-gray-900 font-medium">{insight.message}</p>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <span>{getInsightCategoryDisplay(insight.category)}</span>
              <span className="mx-2">•</span>
              <span>
                {new Intl.DateTimeFormat('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                }).format(new Date(insight.date))}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(insight.id)}
          className="text-gray-400 hover:text-gray-600"
          aria-label={t('insight.dismiss')}
          tabIndex={0}
        >
          ✕
        </button>
      </div>

      {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-medium text-gray-900 mb-1">{t('insight.metrics')}</h3>
          <div className="flex flex-wrap gap-2">
            {insight.relatedMetrics.map((metric) => (
              <span
                key={metric}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-900"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      )}

      {insight.action && (
        <div className="mt-3">
          <Button
            variant="default"
            size="default"
            className={cn('w-full', 'bg-blue-700', 'text-white', 'hover:bg-blue-800')}
            onClick={onAction}
          >
            {insight.action.message}
          </Button>
        </div>
      )}
    </article>
  );
};
