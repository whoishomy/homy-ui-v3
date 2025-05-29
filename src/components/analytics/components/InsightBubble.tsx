'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { InsightCategory } from '@/types/analytics';
import { useInsightCategoryDisplay } from '@/hooks/useInsightCategoryDisplay';
import { useTranslation } from 'next-i18next';

type InsightType = 'info' | 'success' | 'warning' | 'critical';

interface InsightBubbleProps {
  id?: string;
  message: string;
  type?: InsightType;
  priority?: 'low' | 'medium' | 'high';
  category?: InsightCategory;
  className?: string;
  tooltipContent?: React.ReactNode;
  onAction?: (action: string) => void;
}

const ICONS: Record<InsightType, React.ReactNode> = {
  info: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
  success: <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
  critical: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />,
};

const bubbleVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const InsightBubble: React.FC<InsightBubbleProps> = ({
  message,
  type = 'info',
  priority = 'medium',
  category,
  className = '',
  tooltipContent,
}) => {
  const { t } = useTranslation('analytics');
  const { getDisplay } = useInsightCategoryDisplay();
  const showTooltip = priority === 'high' && (type === 'critical' || type === 'warning');
  const defaultTooltip = t('insights.tooltips.default');

  const bubble = (
    <motion.div
      role="note"
      aria-live="polite"
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={clsx(
        'flex items-start gap-2 p-3 rounded-md shadow-sm border text-sm transition-colors cursor-default',
        {
          'bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20':
            type === 'info',
          'bg-green-50 text-green-800 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20':
            type === 'success',
          'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/20':
            type === 'warning',
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20':
            type === 'critical',
        },
        className
      )}
    >
      <motion.div
        className="pt-0.5"
        initial={{ rotate: -10, scale: 0.5 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {ICONS[type]}
      </motion.div>
      <div className="flex-1">
        <p>{message}</p>
        {category && <span className="text-xs mt-1 opacity-75">{getDisplay(category)}</span>}
      </div>
      {priority === 'high' && (
        <motion.span
          className="ml-2 text-xs font-semibold text-red-600 dark:text-red-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {t('insights.priority')}
        </motion.span>
      )}
    </motion.div>
  );

  if (showTooltip) {
    return <Tooltip content={tooltipContent || defaultTooltip}>{bubble}</Tooltip>;
  }

  return bubble;
};
