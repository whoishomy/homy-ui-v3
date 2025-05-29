'use client';

import React, { FC } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type StatusTrendType = 'info' | 'success' | 'warning' | 'error';

type StatusTrendCardProps = {
  title: string;
  score: number;
  change?: number;
  trendLabel?: string;
  className?: string;
  'aria-label'?: string;
  type?: StatusTrendType;
  formatValue?: (score: number) => string;
  aiRecommendation?: string;
  recommendationPriority?: 'low' | 'medium' | 'high';
  actionable?: boolean;
  onActionClick?: () => void;
};

const TYPE_STYLES: Record<StatusTrendType, string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
};

const PRIORITY_STYLES = {
  low: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const COLORS = ['#4ade80', '#e5e7eb']; // green + gray

export const StatusTrendCard: FC<StatusTrendCardProps> = ({
  title,
  score,
  change,
  trendLabel,
  className,
  'aria-label': ariaLabel,
  type = 'info',
  formatValue,
  aiRecommendation,
  recommendationPriority = 'low',
  actionable,
  onActionClick,
}) => {
  const percentage = Math.min(100, Math.max(0, score));
  const isPositive = (change ?? 0) >= 0;
  const typeStyle = type ? TYPE_STYLES[type] : '';

  const data = [
    { name: 'score', value: percentage },
    { name: 'rest', value: 100 - percentage },
  ];

  const formattedValue = formatValue ? formatValue(score) : `${score}%`;
  const trendIconLabel = isPositive ? 'Artış gösteriyor' : 'Düşüş gösteriyor';

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 w-full max-w-sm',
        'dark:bg-gray-800 dark:ring-gray-700 dark:shadow-none',
        className
      )}
      role="status"
      aria-label={ariaLabel || `${title}: ${formattedValue}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center text-xs font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
            role="text"
            aria-label={`${Math.abs(change)}% ${trendIconLabel}`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" role="img" aria-label={trendIconLabel} />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" role="img" aria-label={trendIconLabel} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <PieChart width={64} height={64}>
            <Pie
              data={data}
              cx={32}
              cy={32}
              innerRadius={22}
              outerRadius={30}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className={cn(
                    index === 0 ? typeStyle : 'text-gray-200 dark:text-gray-600',
                    'fill-current'
                  )}
                />
              ))}
            </Pie>
          </PieChart>
          <span className={cn('absolute text-sm font-medium', typeStyle)}>{formattedValue}</span>
        </div>

        <div className="flex-1 min-w-0">
          {trendLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{trendLabel}</p>
          )}
          {aiRecommendation && (
            <div
              className={cn('mt-2 p-2 rounded-lg text-xs', PRIORITY_STYLES[recommendationPriority])}
            >
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p>{aiRecommendation}</p>
              </div>
              {actionable && (
                <Button
                  className="mt-2 w-full justify-center hover:bg-white/10"
                  onClick={onActionClick}
                  aria-label={`${title} için önerileri gör`}
                >
                  Önerileri Gör
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
