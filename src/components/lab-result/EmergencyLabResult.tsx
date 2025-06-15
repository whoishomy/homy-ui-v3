'use client';

import { useEffect, useState } from 'react';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { EmergencyInsightBubble } from './EmergencyInsightBubble';
import { EmergencyFooterMessage } from './EmergencyFooterMessage';
import { AIResponseHandler } from '@/utils/aiResponseHandler';
import type { LabResult } from '@/types/lab-results';
import { AlertTriangle, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';

interface Props {
  result: LabResult;
  onAction?: () => void;
}

export function EmergencyLabResult({ result, onAction }: Props) {
  const { trademarkStyle } = useTrademarkStyle();
  const [insight, setInsight] = useState<Awaited<
    ReturnType<typeof AIResponseHandler.prototype.generateInsight>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isHighSeverity = result.severity === 'critical';

  useEffect(() => {
    const loadInsight = async () => {
      try {
        const handler = AIResponseHandler.getInstance();
        const response = await handler.generateInsight({
          labResult: result,
          userRole: 'physician',
          timestamp: new Date().toISOString(),
        });
        setInsight(response);
      } catch (error) {
        console.error('Failed to generate insight:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInsight();
  }, [result]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Analyzing results...</div>;
  }

  if (!insight) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to analyze results. Please try again.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        isHighSeverity ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50',
        'dark:border-opacity-10 dark:bg-opacity-10'
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isHighSeverity ? (
            <AlertOctagon
              className="h-5 w-5 text-red-600 dark:text-red-400"
              style={trademarkStyle}
            />
          ) : (
            <AlertTriangle
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
              style={trademarkStyle}
            />
          )}
          <h3
            className={cn(
              'font-medium',
              isHighSeverity
                ? 'text-red-900 dark:text-red-200'
                : 'text-yellow-900 dark:text-yellow-200'
            )}
          >
            {result.testName}
          </h3>
        </div>
        {onAction && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 gap-1 px-2 py-1',
              isHighSeverity
                ? 'text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/20'
                : 'text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-900/20'
            )}
            onClick={onAction}
          >
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Test Details */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Test Date</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(result.date, 'MMM d, yyyy')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Result</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.value}</dd>
          </div>
          {result.referenceRange && (
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Normal Range</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {result.referenceRange.min} - {result.referenceRange.max}{' '}
                {result.referenceRange.unit}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
            <dd
              className={cn(
                'text-sm font-medium',
                isHighSeverity
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-yellow-700 dark:text-yellow-300'
              )}
            >
              {result.severity === 'critical' ? 'Critical' : 'Warning'}
            </dd>
          </div>
        </div>

        {/* Alert Message */}
        <p
          className={cn(
            'text-sm',
            isHighSeverity
              ? 'text-red-700 dark:text-red-300'
              : 'text-yellow-700 dark:text-yellow-300'
          )}
        >
          {result.message}
        </p>
      </div>
    </div>
  );
}
