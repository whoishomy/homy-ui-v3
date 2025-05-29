import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useInsightTelemetry } from '../useInsightTelemetry';
import type { InsightInteraction } from '@/services/telemetry/InsightTelemetry';

describe('useInsightTelemetry', () => {
  const mockProps = {
    insightId: 'test-insight-1',
    type: 'success',
    priority: 'high',
  };

  // Mock window.analytics
  const mockTrack = vi.fn();
  const mockDispatchEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.analytics = { track: mockTrack };
    window.dispatchEvent = mockDispatchEvent;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct props', () => {
    const { result } = renderHook(() => useInsightTelemetry(mockProps));

    expect(result.current).toHaveProperty('logInteraction');
    expect(result.current).toHaveProperty('onTooltipShown');
    expect(result.current).toHaveProperty('onTooltipClicked');
    expect(result.current).toHaveProperty('onTooltipActionClicked');
  });

  describe('logInteraction', () => {
    it('should track interaction with correct payload', () => {
      const { result } = renderHook(() => useInsightTelemetry(mockProps));

      act(() => {
        result.current.logInteraction('tooltip_shown');
      });

      expect(mockTrack).toHaveBeenCalledWith(
        'insight_interaction',
        expect.objectContaining({
          insightId: mockProps.insightId,
          type: 'tooltip_shown',
          metadata: expect.objectContaining({
            insightType: mockProps.type,
            insightPriority: mockProps.priority,
          }),
        })
      );
    });

    it('should emit custom event', () => {
      const { result } = renderHook(() => useInsightTelemetry(mockProps));

      act(() => {
        result.current.logInteraction('tooltip_clicked');
      });

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'insight-interaction',
          detail: expect.objectContaining({
            insightId: mockProps.insightId,
            type: 'tooltip_clicked',
          }),
        })
      );
    });
  });

  describe('Tooltip interactions', () => {
    it('should track tooltip shown with duration', () => {
      const { result } = renderHook(() => useInsightTelemetry(mockProps));
      const startTime = Date.now();

      vi.advanceTimersByTime(1000); // 1 second passed

      act(() => {
        result.current.onTooltipShown(startTime);
      });

      expect(mockTrack).toHaveBeenCalledWith(
        'insight_interaction',
        expect.objectContaining({
          type: 'tooltip_shown',
          metadata: expect.objectContaining({
            tooltipDuration: 1000,
            viewTimestamp: startTime,
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

      expect(mockTrack).toHaveBeenCalledWith(
        'insight_interaction',
        expect.objectContaining({
          type: 'tooltip_clicked',
          metadata: expect.objectContaining({
            tooltipAction: action,
            interactionTimestamp: expect.any(Number),
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

      expect(mockTrack).toHaveBeenCalledWith(
        'insight_interaction',
        expect.objectContaining({
          type: 'tooltip_action_clicked',
          metadata: expect.objectContaining({
            tooltipAction: action,
            actionTimestamp: expect.any(Number),
          }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle missing analytics gracefully', () => {
      window.analytics = undefined;
      const { result } = renderHook(() => useInsightTelemetry(mockProps));

      expect(() => {
        act(() => {
          result.current.logInteraction('tooltip_shown');
        });
      }).not.toThrow();
    });

    it('should handle event dispatch errors', () => {
      window.dispatchEvent = vi.fn().mockImplementation(() => {
        throw new Error('Event dispatch failed');
      });

      const { result } = renderHook(() => useInsightTelemetry(mockProps));

      expect(() => {
        act(() => {
          result.current.logInteraction('tooltip_shown');
        });
      }).not.toThrow();
    });
  });
});
