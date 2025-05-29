'use client';

import { cn } from '@/utils/cn';
import { useState } from 'react';

interface InsightOverlayProps {
  className?: string;
}

export function InsightOverlay({ className }: InsightOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">AI Health Insights</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Live
          </span>
        </div>

        {/* Placeholder insights - replace with actual AI insights */}
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Based on your recent hemoglobin levels, your iron absorption appears to be optimal.
              Continue with your current diet plan.
            </p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Slight elevation in white blood cell count. This could indicate a minor infection.
              Monitor for any symptoms.
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200">
              Platelet count is within normal range, indicating good blood clotting function.
            </p>
          </div>
        </div>

        <button
          className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Generate New Insights'}
        </button>
      </div>
    </div>
  );
}
