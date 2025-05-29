'use client';

import { useCallback } from 'react';
import type {
  InsightInteractionType,
  InsightInteraction,
} from '@/services/telemetry/InsightTelemetry';
import { trackAnalyticsEvent } from '@/utils/analytics';

interface UseInsightTelemetryProps {
  insightId: string;
  type?: string;
  priority?: string;
}

export function useInsightTelemetry({ insightId, type, priority }: UseInsightTelemetryProps) {
  const logInteraction = useCallback(
    (
      interactionType: InsightInteractionType,
      metadata?: Partial<InsightInteraction['metadata']>
    ) => {
      const interaction: InsightInteraction = {
        insightId,
        type: interactionType,
        timestamp: Date.now(),
        metadata: {
          insightType: type,
          insightPriority: priority,
          ...metadata,
        },
      };

      trackAnalyticsEvent('insight_interaction', interaction);

      // Emit custom event for real-time tracking
      const event = new CustomEvent('insight-interaction', {
        detail: interaction,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);

      return interaction;
    },
    [insightId, type, priority]
  );

  const onTooltipShown = useCallback(
    (startTime: number) => {
      return logInteraction('tooltip_shown', {
        tooltipDuration: Date.now() - startTime,
        viewTimestamp: startTime,
      });
    },
    [logInteraction]
  );

  const onTooltipClicked = useCallback(
    (action?: string) => {
      return logInteraction('tooltip_clicked', {
        tooltipAction: action,
        interactionTimestamp: Date.now(),
      });
    },
    [logInteraction]
  );

  const onTooltipActionClicked = useCallback(
    (action: string) => {
      return logInteraction('tooltip_action_clicked', {
        tooltipAction: action,
        actionTimestamp: Date.now(),
      });
    },
    [logInteraction]
  );

  return {
    logInteraction,
    onTooltipShown,
    onTooltipClicked,
    onTooltipActionClicked,
  };
}
