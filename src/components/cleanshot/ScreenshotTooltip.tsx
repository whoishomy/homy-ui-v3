'use client';

import { format } from 'date-fns';
import { cn } from '@/utils/cn';

interface ScreenshotTooltipProps {
  variant: string;
  viewport: string;
  scale: string;
  createdAt: string;
  darkMode: boolean;
  className?: string;
}

export function ScreenshotTooltip({
  variant,
  viewport,
  scale,
  createdAt,
  darkMode,
  className,
}: ScreenshotTooltipProps) {
  return (
    <div
      className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-white dark:bg-gray-800',
        'rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        'text-sm w-64 pointer-events-none z-10',
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Variant</span>
          <span className="text-gray-600 dark:text-gray-400">{variant}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Viewport</span>
          <span className="text-gray-600 dark:text-gray-400">{viewport}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Scale</span>
          <span className="text-gray-600 dark:text-gray-400">{scale}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Theme</span>
          <span className="text-gray-600 dark:text-gray-400">{darkMode ? 'Dark' : 'Light'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Created</span>
          <span className="text-gray-600 dark:text-gray-400">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700" />
    </div>
  );
}
