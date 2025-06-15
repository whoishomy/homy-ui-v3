import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useInsightTelemetry } from '../useInsightTelemetry';
import type { InsightInteractionType } from '@/services/telemetry/InsightTelemetry';

// Mock analytics utility
jest.mock('@/utils/analytics', () => ({
  trackAnalyticsEvent: jest.fn(),
}));

describe('useInsightTelemetry', () => {
  const mockProps = {
    insightId: 'test-insight-id',
    type: 'test-type',
    priority: 'high',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.dispatchEvent
    window.dispatchEvent = jest.fn();
  });

  it('should log interaction with correct payload', () => {
    const { result } = renderHook(() => useInsightTelemetry(mockProps));
    const interactionType: InsightInteractionType = 'tooltip_shown';

    act(() => {
      result.current.logInteraction(interactionType);
    });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'insight-interaction',
        detail: expect.objectContaining({
          insightId: mockProps.insightId,
          type: interactionType,
          metadata: expect.objectContaining({
            insightType: mockProps.type,
            insightPriority: mockProps.priority,
          }),
        }),
      })
    );
  });

  it('should track tooltip shown with duration', () => {
    const { result } = renderHook(() => useInsightTelemetry(mockProps));
    const startTime = Date.now();

    act(() => {
      result.current.onTooltipShown(startTime);
    });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'insight-interaction',
        detail: expect.objectContaining({
          type: 'tooltip_shown',
          metadata: expect.objectContaining({
            tooltipDuration: expect.any(Number),
            viewTimestamp: startTime,
          }),
        }),
      })
    );
  });

  it('should track tooltip clicked with action', () => {
    const { result } = renderHook(() => useInsightTelemetry(mockProps));
    const action = 'view_details';

    act(() => {
      result.current.onTooltipClicked(action);
    });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'insight-interaction',
        detail: expect.objectContaining({
          type: 'tooltip_clicked',
          metadata: expect.objectContaining({
            tooltipAction: action,
            interactionTimestamp: expect.any(Number),
          }),
        }),
      })
    );
  });

  it('should track tooltip action clicked', () => {
    const { result } = renderHook(() => useInsightTelemetry(mockProps));
    const action = 'dismiss';

    act(() => {
      result.current.onTooltipActionClicked(action);
    });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'insight-interaction',
        detail: expect.objectContaining({
          type: 'tooltip_action_clicked',
          metadata: expect.objectContaining({
            tooltipAction: action,
            actionTimestamp: expect.any(Number),
          }),
        }),
      })
    );
  });
});
