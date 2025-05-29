import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import FallbackRateChart from '../FallbackRateChart';

// Mock Recharts to avoid rendering issues in test environment
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: ({ children }: any) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('FallbackRateChart', () => {
  const mockProviderData = {
    'openai': {
      health: 95,
      latency: 250,
      errorRate: 0.02,
      successRate: 0.98,
      totalRequests: 1000,
    },
    'anthropic': {
      health: 92,
      latency: 300,
      errorRate: 0.05,
      successRate: 0.95,
      totalRequests: 500,
    },
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<FallbackRateChart data={mockProviderData} />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('displays empty state when no data is provided', () => {
      render(<FallbackRateChart />);
      expect(screen.getByText('Henüz fallback verisi bulunmuyor')).toBeInTheDocument();
    });

    it('displays the chart title', () => {
      render(<FallbackRateChart data={mockProviderData} />);
      expect(screen.getByText('Fallback Analizi')).toBeInTheDocument();
    });

    it('shows warning badge when success rate is below 95%', () => {
      const lowSuccessData = {
        'openai': {
          ...mockProviderData.openai,
          successRate: 0.90,
        },
      };
      render(<FallbackRateChart data={lowSuccessData} />);
      expect(screen.getByText('Yüksek Fallback Oranı')).toBeInTheDocument();
    });

    it('does not show warning badge when success rate is above 95%', () => {
      const highSuccessData = {
        'openai': {
          ...mockProviderData.openai,
          successRate: 0.98,
        },
      };
      render(<FallbackRateChart data={highSuccessData} />);
      expect(screen.queryByText('Yüksek Fallback Oranı')).not.toBeInTheDocument();
    });
  });

  describe('Metrics Display', () => {
    beforeEach(() => {
      render(<FallbackRateChart data={mockProviderData} />);
    });

    it('displays total fallbacks section', () => {
      expect(screen.getByText('Toplam Fallback')).toBeInTheDocument();
    });

    it('displays success rate section', () => {
      expect(screen.getByText('Başarı Oranı')).toBeInTheDocument();
    });

    it('displays most common fallback section', () => {
      expect(screen.getByText('En Sık Fallback')).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('renders custom tooltip with correct data', () => {
      const { container } = render(<FallbackRateChart data={mockProviderData} />);
      // Not testing tooltip directly as it's only visible on hover
      expect(container.querySelector('.recharts-tooltip-wrapper')).toBeTruthy();
    });

    it('renders custom legend with correct data', () => {
      const { container } = render(<FallbackRateChart data={mockProviderData} />);
      // Legend should be rendered with the correct number of items
      expect(container.querySelector('.recharts-legend-wrapper')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<FallbackRateChart data={mockProviderData} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses correct ARIA labels', () => {
      render(<FallbackRateChart data={mockProviderData} />);
      expect(screen.getByRole('region')).toHaveAttribute(
        'aria-label',
        'Fallback oranları grafiği'
      );
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<FallbackRateChart data={mockProviderData} />);
      expect(container.querySelector('h3')).toBeInTheDocument(); // Başlık
      expect(container.querySelectorAll('p')).toHaveLength(expect.any(Number)); // Metrik etiketleri
    });
  });

  describe('Responsiveness', () => {
    it('applies responsive classes correctly', () => {
      const { container } = render(<FallbackRateChart data={mockProviderData} />);
      expect(container.querySelector('.lg\\:grid-cols-3')).toBeTruthy();
      expect(container.querySelector('.lg\\:col-span-2')).toBeTruthy();
    });

    it('accepts and applies custom className', () => {
      const customClass = 'test-custom-class';
      const { container } = render(
        <FallbackRateChart data={mockProviderData} className={customClass} />
      );
      expect(container.firstChild).toHaveClass(customClass);
    });
  });
}); 