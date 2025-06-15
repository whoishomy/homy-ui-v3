import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InsightOverlay } from '../components/InsightOverlay';
import type { Insight } from '@/cases/tayfun/insights';

expect.extend(toHaveNoViolations);

const mockInsights: Insight[] = [
  {
    id: 'vital-1',
    title: 'Yüksek Tansiyon Riski',
    description: 'Son ölçümlerinize göre tansiyon değerleriniz yükseliş eğiliminde.',
    severity: 'high',
    category: 'vital',
    date: new Date(),
  },
  {
    id: 'activity-1',
    title: 'Düşük Aktivite Seviyesi',
    description: 'Bu hafta hedeflenen aktivite seviyesinin altında kaldınız.',
    severity: 'medium',
    category: 'activity',
    date: new Date(),
  },
  {
    id: 'sleep-1',
    title: 'Uyku Düzeni İyileşiyor',
    description: 'Uyku düzeniniz son 2 haftada belirgin şekilde iyileşme gösterdi.',
    severity: 'low',
    category: 'sleep',
    date: new Date(),
  },
];

describe('InsightOverlay Accessibility Tests', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('focuses close button on mount', () => {
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /kapat/i });
      expect(closeButton).toHaveFocus();
    });

    it('traps focus within the overlay', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const focusableElements = screen.getAllByRole('button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Tab from last to first
      await user.tab({ shift: true });
      expect(lastElement).toHaveFocus();

      // Tab from first to last
      await user.tab();
      expect(firstElement).toHaveFocus();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('supports arrow key navigation between insights', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const insights = screen.getAllByRole('article');
      insights[0].focus();
      expect(insights[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(insights[1]).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(insights[0]).toHaveFocus();
    });
  });

  describe('ARIA Attributes', () => {
    it('has correct ARIA roles and labels', () => {
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-labelledby',
        'insight-overlay-title'
      );
    });

    it('has proper heading structure', () => {
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('İçgörü Telemetrisi');

      const insightHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(insightHeadings).toHaveLength(mockInsights.length);
    });

    it('has proper status indicators', () => {
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const statusIndicators = screen.getAllByRole('status');
      expect(statusIndicators).toHaveLength(mockInsights.length);

      expect(statusIndicators[0]).toHaveAttribute('aria-label', 'Öncelik: Yüksek');
      expect(statusIndicators[1]).toHaveAttribute('aria-label', 'Öncelik: Orta');
      expect(statusIndicators[2]).toHaveAttribute('aria-label', 'Öncelik: Düşük');
    });
  });

  describe('Motion and Animation', () => {
    beforeEach(() => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
    });

    it('respects reduced motion preferences', () => {
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const overlay = screen.getByRole('dialog');
      const computedStyle = window.getComputedStyle(overlay);

      expect(computedStyle.transition).toBe('none');
    });
  });

  describe('Color Contrast', () => {
    it('maintains sufficient color contrast for all text elements', async () => {
      const { container } = render(
        <InsightOverlay insights={mockInsights} onClose={mockOnClose} />
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('has visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay insights={mockInsights} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /kapat/i });
      await user.tab();

      const computedStyle = window.getComputedStyle(closeButton);
      expect(computedStyle.outline).not.toBe('none');
    });
  });
});
