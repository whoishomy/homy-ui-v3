import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InsightBubble } from '../components/InsightBubble';
import { InsightCategory } from '@/types/analytics';
import { getInsightCategoryDisplay } from '@/utils/insightCategory';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock Radix Tooltip
vi.mock('@radix-ui/react-tooltip', () => ({
  Root: ({ children, onOpenChange }: any) => (
    <div data-testid="tooltip-root" onClick={() => onOpenChange?.(true)}>
      {children}
    </div>
  ),
  Trigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
  Content: ({ children, onClick }: any) => (
    <div data-testid="tooltip-content" onClick={onClick}>
      {children}
    </div>
  ),
  Provider: ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>,
  Portal: ({ children }: any) => <div data-testid="tooltip-portal">{children}</div>,
  Arrow: () => <div data-testid="tooltip-arrow" />,
}));

// Mock useInsightTelemetry
vi.mock('@/hooks/useInsightTelemetry', () => ({
  useInsightTelemetry: () => ({
    onTooltipShown: vi.fn(),
    onTooltipClicked: vi.fn(),
    onTooltipActionClicked: vi.fn(),
  }),
}));

expect.extend(toHaveNoViolations);

describe('InsightBubble', () => {
  const defaultMessage = 'Test insight message';

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<InsightBubble message={defaultMessage} />);

      expect(screen.getByText(defaultMessage)).toBeInTheDocument();
      expect(screen.getByRole('note')).toHaveClass('bg-blue-50', 'text-blue-800');
    });

    it('renders with success type', () => {
      render(<InsightBubble message={defaultMessage} type="success" />);

      const bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('bg-green-50', 'text-green-800');
      expect(bubble.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('renders with warning type', () => {
      render(<InsightBubble message={defaultMessage} type="warning" />);

      const bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('bg-yellow-50', 'text-yellow-900');
      expect(bubble.querySelector('svg')).toHaveClass('text-yellow-500');
    });

    it('renders with critical type', () => {
      render(<InsightBubble message={defaultMessage} type="critical" />);

      const bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('bg-red-50', 'text-red-800');
      expect(bubble.querySelector('svg')).toHaveClass('text-red-600');
    });

    it('shows priority label for high priority insights', () => {
      render(<InsightBubble message={defaultMessage} priority="high" />);

      expect(screen.getByText('Öncelikli')).toBeInTheDocument();
      expect(screen.getByText('Öncelikli')).toHaveClass('text-red-600');
    });

    it('does not show priority label for medium and low priority', () => {
      const { rerender } = render(<InsightBubble message={defaultMessage} priority="medium" />);
      expect(screen.queryByText('Öncelikli')).not.toBeInTheDocument();

      rerender(<InsightBubble message={defaultMessage} priority="low" />);
      expect(screen.queryByText('Öncelikli')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<InsightBubble message={defaultMessage} className="custom-class" />);
      expect(screen.getByRole('note')).toHaveClass('custom-class');
    });

    it('applies animation props', () => {
      render(<InsightBubble message={defaultMessage} />);
      const bubble = screen.getByRole('note');

      expect(bubble).toHaveAttribute('initial', 'initial');
      expect(bubble).toHaveAttribute('animate', 'animate');
      expect(bubble).toHaveAttribute('whileHover', 'hover');
      expect(bubble).toHaveAttribute('whileTap', 'tap');
    });
  });

  describe('Tooltip Behavior', () => {
    it('shows tooltip for high priority warning insights', () => {
      render(
        <InsightBubble
          message={defaultMessage}
          type="warning"
          priority="high"
          tooltipContent="Custom tooltip"
        />
      );

      expect(screen.getByTestId('tooltip-root')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('shows tooltip for high priority critical insights', () => {
      render(
        <InsightBubble
          message={defaultMessage}
          type="critical"
          priority="high"
          tooltipContent="Custom tooltip"
        />
      );

      expect(screen.getByTestId('tooltip-root')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('does not show tooltip for non-high priority insights', () => {
      render(
        <InsightBubble
          message={defaultMessage}
          type="warning"
          priority="medium"
          tooltipContent="Custom tooltip"
        />
      );

      expect(screen.queryByTestId('tooltip-root')).not.toBeInTheDocument();
    });

    it('uses default tooltip content when not provided', () => {
      render(<InsightBubble message={defaultMessage} type="warning" priority="high" />);

      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('uses custom tooltip content when provided', () => {
      const customTooltip = 'Custom tooltip content';
      render(
        <InsightBubble
          message={defaultMessage}
          type="warning"
          priority="high"
          tooltipContent={customTooltip}
        />
      );

      expect(screen.getByText(customTooltip)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<InsightBubble message={defaultMessage} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses correct ARIA attributes', () => {
      render(<InsightBubble message={defaultMessage} />);

      const bubble = screen.getByRole('note');
      expect(bubble).toHaveAttribute('aria-live', 'polite');
    });

    it('maintains color contrast ratios', () => {
      const { rerender } = render(<InsightBubble message={defaultMessage} type="info" />);
      let bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('text-blue-800', 'bg-blue-50');

      rerender(<InsightBubble message={defaultMessage} type="warning" />);
      bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('text-yellow-900', 'bg-yellow-50');

      rerender(<InsightBubble message={defaultMessage} type="critical" />);
      bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('text-red-800', 'bg-red-50');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes', () => {
      render(
        <div className="dark">
          <InsightBubble message={defaultMessage} />
        </div>
      );

      const bubble = screen.getByRole('note');
      expect(bubble).toHaveClass('dark:bg-blue-900/10', 'dark:text-blue-400');
    });
  });

  describe('Edge Cases', () => {
    it('handles long messages', () => {
      const longMessage = 'A'.repeat(200);
      render(<InsightBubble message={longMessage} />);

      const bubble = screen.getByRole('note');
      expect(bubble).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles empty message gracefully', () => {
      render(<InsightBubble message="" />);
      const bubble = screen.getByRole('note');
      expect(bubble).toBeInTheDocument();
      expect(bubble.textContent).toBe('');
    });

    it('handles HTML entities in message', () => {
      const messageWithEntities = 'Test & message > with < entities';
      render(<InsightBubble message={messageWithEntities} />);
      expect(screen.getByText(messageWithEntities)).toBeInTheDocument();
    });
  });

  describe('Telemetry Integration', () => {
    it('tracks tooltip interactions', () => {
      const { useInsightTelemetry } = require('@/hooks/useInsightTelemetry');
      const mockTelemetry = {
        onTooltipShown: vi.fn(),
        onTooltipClicked: vi.fn(),
        onTooltipActionClicked: vi.fn(),
      };
      useInsightTelemetry.mockReturnValue(mockTelemetry);

      render(
        <InsightBubble id="test-insight" message={defaultMessage} type="warning" priority="high" />
      );

      // Simulate tooltip open
      fireEvent.click(screen.getByTestId('tooltip-root'));
      expect(mockTelemetry.onTooltipShown).toHaveBeenCalled();

      // Simulate tooltip content click
      fireEvent.click(screen.getByTestId('tooltip-content'));
      expect(mockTelemetry.onTooltipClicked).toHaveBeenCalled();
    });

    it('tracks tooltip action clicks', () => {
      const onAction = vi.fn();
      const { useInsightTelemetry } = require('@/hooks/useInsightTelemetry');
      const mockTelemetry = {
        onTooltipShown: vi.fn(),
        onTooltipClicked: vi.fn(),
        onTooltipActionClicked: vi.fn(),
      };
      useInsightTelemetry.mockReturnValue(mockTelemetry);

      render(
        <InsightBubble
          id="test-insight"
          message={defaultMessage}
          type="warning"
          priority="high"
          onAction={onAction}
        />
      );

      // Find and click the action button
      const actionButton = screen.getByText('Detaylı bilgi');
      fireEvent.click(actionButton);

      expect(onAction).toHaveBeenCalledWith('view_details');
      expect(mockTelemetry.onTooltipActionClicked).toHaveBeenCalled();
    });

    it('includes correct metadata in telemetry events', () => {
      const { useInsightTelemetry } = require('@/hooks/useInsightTelemetry');
      const mockTelemetry = {
        onTooltipShown: vi.fn(),
        onTooltipClicked: vi.fn(),
        onTooltipActionClicked: vi.fn(),
      };
      useInsightTelemetry.mockReturnValue(mockTelemetry);

      render(
        <InsightBubble id="test-insight" message={defaultMessage} type="critical" priority="high" />
      );

      expect(useInsightTelemetry).toHaveBeenCalledWith({
        insightId: 'test-insight',
        type: 'critical',
        priority: 'high',
      });
    });
  });

  describe('Category Display', () => {
    it('renders category when provided', () => {
      render(<InsightBubble message={defaultMessage} category={InsightCategory.PHYSICAL} />);

      expect(
        screen.getByText(getInsightCategoryDisplay(InsightCategory.PHYSICAL))
      ).toBeInTheDocument();
    });

    it('does not render category when not provided', () => {
      render(<InsightBubble message={defaultMessage} />);

      const categoryTexts = Object.values(InsightCategory).map((category) =>
        getInsightCategoryDisplay(category)
      );

      categoryTexts.forEach((text) => {
        expect(screen.queryByText(text)).not.toBeInTheDocument();
      });
    });

    it('renders category with correct styling', () => {
      render(<InsightBubble message={defaultMessage} category={InsightCategory.HEALTH} />);

      const categoryElement = screen.getByText(getInsightCategoryDisplay(InsightCategory.HEALTH));
      expect(categoryElement).toHaveClass('text-xs', 'mt-1', 'opacity-75');
    });

    it('renders multiple categories correctly', () => {
      const { rerender } = render(
        <InsightBubble message={defaultMessage} category={InsightCategory.PHYSICAL} />
      );

      expect(
        screen.getByText(getInsightCategoryDisplay(InsightCategory.PHYSICAL))
      ).toBeInTheDocument();

      rerender(<InsightBubble message={defaultMessage} category={InsightCategory.MENTAL} />);

      expect(
        screen.getByText(getInsightCategoryDisplay(InsightCategory.MENTAL))
      ).toBeInTheDocument();
    });
  });
});
