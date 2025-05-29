import { render, screen } from '@testing-library/react';
import { StatusTrendCard } from '../components/StatusTrendCard';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('StatusTrendCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    score: 85.5,
    change: 5.2,
    trendLabel: 'son 24 saat',
  };

  describe('Rendering', () => {
    it('renders basic card with title and score', () => {
      render(<StatusTrendCard {...defaultProps} />);

      expect(screen.getByText('Test Metric')).toBeInTheDocument();
      expect(screen.getByText('85.5%')).toBeInTheDocument();
    });

    it('applies correct type-based styles', () => {
      const { rerender } = render(<StatusTrendCard {...defaultProps} type="success" />);
      expect(screen.getByText('85.5%')).toHaveClass('text-green-500');

      rerender(<StatusTrendCard {...defaultProps} type="error" />);
      expect(screen.getByText('85.5%')).toHaveClass('text-red-500');

      rerender(<StatusTrendCard {...defaultProps} type="warning" />);
      expect(screen.getByText('85.5%')).toHaveClass('text-yellow-500');

      rerender(<StatusTrendCard {...defaultProps} type="info" />);
      expect(screen.getByText('85.5%')).toHaveClass('text-blue-500');
    });

    it('formats value using custom formatter', () => {
      render(<StatusTrendCard {...defaultProps} formatValue={(v) => `${v.toFixed(0)}ms`} />);

      expect(screen.getByText('86ms')).toBeInTheDocument();
    });

    it('shows trend indicator and label when provided', () => {
      render(<StatusTrendCard {...defaultProps} />);

      const trendValue = screen.getByText('5.2%');
      const trendLabel = screen.getByText('son 24 saat');

      expect(trendValue).toBeInTheDocument();
      expect(trendLabel).toBeInTheDocument();
    });

    it('handles negative change values', () => {
      render(<StatusTrendCard {...defaultProps} change={-3.5} />);

      const trendValue = screen.getByText('3.5%');
      expect(trendValue).toHaveClass('text-red-600');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<StatusTrendCard {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses correct ARIA labels', () => {
      render(<StatusTrendCard {...defaultProps} />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', 'Test Metric: 85.5%');
    });

    it('uses custom ARIA label when provided', () => {
      render(<StatusTrendCard {...defaultProps} aria-label="Custom metric status" />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', 'Custom metric status');
    });

    it('provides descriptive labels for trend icons', () => {
      const { rerender } = render(<StatusTrendCard {...defaultProps} change={5.2} />);

      let trendIcon = screen.getByRole('img');
      expect(trendIcon).toHaveAttribute('aria-label', 'Artış gösteriyor');

      rerender(<StatusTrendCard {...defaultProps} change={-3.5} />);
      trendIcon = screen.getByRole('img');
      expect(trendIcon).toHaveAttribute('aria-label', 'Düşüş gösteriyor');
    });

    it('provides combined trend information', () => {
      const { rerender } = render(<StatusTrendCard {...defaultProps} change={5.2} />);

      let trendContainer = screen.getByRole('text');
      expect(trendContainer).toHaveAttribute('aria-label', '5.2% Artış gösteriyor');

      rerender(<StatusTrendCard {...defaultProps} change={-3.5} />);
      trendContainer = screen.getByRole('text');
      expect(trendContainer).toHaveAttribute('aria-label', '3.5% Düşüş gösteriyor');
    });

    it('marks info icon as decorative', () => {
      render(<StatusTrendCard {...defaultProps} aiRecommendation="Test recommendation" />);
      const infoIcon = screen.getByRole('presentation', { hidden: true });
      expect(infoIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes', () => {
      const { container } = render(<StatusTrendCard {...defaultProps} />);

      expect(container.firstChild).toHaveClass('dark:bg-gray-800');
      expect(container.firstChild).toHaveClass('dark:ring-gray-700');
    });

    it('uses correct dark mode text colors', () => {
      render(<StatusTrendCard {...defaultProps} type="success" />);

      expect(screen.getByText('Test Metric')).toHaveClass('dark:text-gray-100');
      expect(screen.getByText('85.5%')).toHaveClass('dark:text-green-400');
    });
  });

  describe('Edge Cases', () => {
    it('clamps score to 0-100 range', () => {
      const { rerender } = render(<StatusTrendCard {...defaultProps} score={150} />);
      expect(screen.getByText('100%')).toBeInTheDocument();

      rerender(<StatusTrendCard {...defaultProps} score={-20} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles undefined change and trendLabel', () => {
      render(<StatusTrendCard title="Test Metric" score={85} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText('son 24 saat')).not.toBeInTheDocument();
    });

    it('handles zero score value', () => {
      render(<StatusTrendCard {...defaultProps} score={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Visual Regression', () => {
    const types: Array<'info' | 'success' | 'warning' | 'error'> = [
      'info',
      'success',
      'warning',
      'error',
    ];

    types.forEach((type) => {
      it(`matches ${type} type snapshot`, () => {
        const { container } = render(<StatusTrendCard {...defaultProps} type={type} />);
        expect(container).toMatchSnapshot();
      });
    });

    it('matches snapshot with custom formatting', () => {
      const { container } = render(
        <StatusTrendCard {...defaultProps} formatValue={(v) => `${v.toFixed(1)}ms`} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
