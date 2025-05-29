'use client';

import { useEffect, useState } from 'react';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { EmergencyInsightBubble } from './EmergencyInsightBubble';
import { EmergencyFooterMessage } from './EmergencyFooterMessage';
import { AIResponseHandler } from '@/utils/aiResponseHandler';
import type { LabResult } from '../dashboard/LabResultsPanel';

interface Props {
  labResult: LabResult;
  patientId: string;
  patientName: string;
}

export const EmergencyLabResult = ({ labResult, patientId, patientName }: Props) => {
  const [insight, setInsight] = useState<Awaited<
    ReturnType<typeof AIResponseHandler.prototype.generateInsight>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
      try {
        const handler = AIResponseHandler.getInstance();
        const response = await handler.generateInsight({
          labResult,
          patientId,
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
  }, [labResult, patientId]);

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

  const latestValue = labResult.data[labResult.data.length - 1].value;

  return (
    <>
      {/* Top Alert Banner */}
      <EmergencyAlertBanner
        patientName={patientName}
        labType={labResult.title}
        value={latestValue}
        unit={labResult.unit}
      />

      {/* Main Content */}
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Critical Value Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Lab Result Analysis
          </h2>

          {/* AI Insight Bubble */}
          <EmergencyInsightBubble insight={insight} />

          {/* Additional Information */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              Reference Information
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Normal Range</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {labResult.referenceRange?.min} - {labResult.referenceRange?.max} {labResult.unit}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Current Value</dt>
                <dd className="text-sm font-medium text-red-600 dark:text-red-400">
                  {latestValue} {labResult.unit}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <EmergencyFooterMessage />
    </>
  );
};
