'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import type { HealthMetrics, HealthScoreRange, HealthScoreTrend } from '@/types/health';
import { cn } from '@/lib/utils/cn';

const scoreRangeConfig: Record<HealthScoreRange, {
  color: string;
  darkColor: string;
  label: string;
  description: string;
}> = {
  optimal: {
    color: 'text-emerald-600 dark:text-emerald-400',
    darkColor: 'dark:bg-emerald-400/10',
    label: 'Optimal',
    description: 'Sağlık skorunuz ideal aralıkta',
  },
  moderate: {
    color: 'text-amber-600 dark:text-amber-400',
    darkColor: 'dark:bg-amber-400/10',
    label: 'Orta',
    description: 'Sağlık skorunuz dikkat gerektiriyor',
  },
  critical: {
    color: 'text-rose-600 dark:text-rose-400',
    darkColor: 'dark:bg-rose-400/10',
    label: 'Kritik',
    description: 'Sağlık skorunuz risk altında',
  },
};

const trendIcons: Record<HealthScoreTrend, React.ReactNode> = {
  up: <TrendingUp className="h-4 w-4" />,
  down: <TrendingDown className="h-4 w-4" />,
  stable: <Minus className="h-4 w-4" />,
};

interface HealthScoreCardProps {
  metrics: HealthMetrics;
  className?: string;
}

export const HealthScoreCard = React.forwardRef<HTMLDivElement, HealthScoreCardProps>(
  ({ metrics, className }, ref) => {
    const { currentScore, history, targetScore } = metrics;
    const rangeConfig = scoreRangeConfig[currentScore.range];

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-border/40 bg-card',
          'overflow-hidden transition-all duration-200',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="border-b border-border/40 bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Sağlık Skoru
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {format(new Date(currentScore.date), 'PPP', { locale: tr })}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-accent/50"
              aria-label="Sağlık skoru hakkında bilgi"
            >
              <Info className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {/* Current Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-3xl font-bold tracking-tight',
                    rangeConfig.color
                  )}
                >
                  {currentScore.score}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                    rangeConfig.color,
                    rangeConfig.darkColor
                  )}
                >
                  {trendIcons[currentScore.trend]}
                  {currentScore.change && currentScore.change > 0
                    ? `+${currentScore.change}`
                    : currentScore.change}
                </span>
              </div>
              <p
                className={cn(
                  'text-sm font-medium',
                  rangeConfig.color
                )}
              >
                {rangeConfig.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {rangeConfig.description}
              </p>
            </div>

            {/* Target Score */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Hedef Skor
              </p>
              <p className="text-2xl font-semibold text-card-foreground">
                {targetScore}
              </p>
            </div>

            {/* Recommendations */}
            {metrics.recommendations && metrics.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Öneriler
                </p>
                <ul className="space-y-1">
                  {metrics.recommendations.slice(0, 2).map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground"
                    >
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={history}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--chart-color, #10b981)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--chart-color, #10b981)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: tr })}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
                      <p className="text-sm font-medium text-popover-foreground">
                        {format(new Date(data.date), 'PPP', { locale: tr })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Skor: {data.score}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--chart-color, #10b981)"
                fill="url(#scoreGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  }
);

HealthScoreCard.displayName = 'HealthScoreCard'; 