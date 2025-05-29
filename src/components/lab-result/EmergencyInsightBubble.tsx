import { cn } from '@/utils/cn';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';
import type { AIResponse } from '@/utils/aiResponseHandler';
import { AlertTriangle, AlertOctagon, ArrowUpRight } from 'lucide-react';

interface Props {
  insight: AIResponse;
  className?: string;
}

export const EmergencyInsightBubble = ({ insight, className }: Props) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();

  const isCritical = insight.metadata.severity === 'critical';
  const isWarning = insight.metadata.severity === 'warning';

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-xl p-4 shadow-lg',
        isCritical ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {isCritical ? (
          <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        )}
        <h3
          className={cn(
            'font-semibold',
            isCritical ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'
          )}
        >
          {isCritical ? 'CRITICAL VALUE DETECTED' : 'Warning: Abnormal Result'}
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Main Message */}
        <div className="text-gray-700 dark:text-gray-200">{insight.content}</div>

        {/* Insights */}
        {insight.insights.map((item, index) => (
          <div
            key={index}
            className={cn(
              'p-3 rounded-lg border',
              isCritical
                ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/30'
                : 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/30'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">{item.type}</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  isCritical
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                )}
              >
                {item.trend && (
                  <span className="flex items-center gap-1">
                    {item.trend}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{item.interpretation}</div>
          </div>
        ))}

        {/* Recommendations */}
        {insight.recommendations && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Immediate Actions Required:
            </h4>
            <ul className="space-y-2">
              {insight.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    rec.priority === 'high'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {rec.action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Medical staff has been notified. Please follow emergency protocol instructions.
        </p>
      </div>
    </div>
  );
};
