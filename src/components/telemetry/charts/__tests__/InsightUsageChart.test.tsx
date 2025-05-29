/// <reference types="vitest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect, beforeEach } from 'vitest';
import InsightUsageChart from '../InsightUsageChart';

interface MockComponentProps {
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  data?: any[];
  margin?: object;
  layout?: string;
  dataKey?: string;
  radius?: number[];
  barSize?: number;
  fill?: string;
  type?: string;
  tick?: object;
  tickLine?: object;
  axisLine?: object;
  strokeDasharray?: string;
  stroke?: string;
  horizontal?: boolean;
  vertical?: boolean;
  content?: React.ReactNode;
  cursor?: object;
}

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height }: MockComponentProps) => (
    <div data-testid="responsive-container" style={{ width, height }}>
      {children}
    </div>
  ),
  BarChart: ({ children, data, margin, layout }: MockComponentProps) => (
    <div data-testid="bar-chart" data-margin={JSON.stringify(margin)} data-layout={layout}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data } as any);
        }
        return child;
      })}
    </div>
  ),
  Bar: ({ children, dataKey, radius, barSize }: MockComponentProps) => (
    <div
      data-testid="bar"
      data-datakey={dataKey}
      data-radius={JSON.stringify(radius)}
      data-barsize={barSize}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }: MockComponentProps) => (
    <div data-testid="bar-cell" style={{ backgroundColor: fill }} />
  ),
  XAxis: ({ type, tick, tickLine, axisLine }: MockComponentProps) => (
    <div
      data-testid="x-axis"
      data-type={type}
      data-tick={JSON.stringify(tick)}
      data-tickline={JSON.stringify(tickLine)}
      data-axisline={JSON.stringify(axisLine)}
    />
  ),
  YAxis: ({ type, dataKey, tick, tickLine, axisLine }: MockComponentProps) => (
    <div
      data-testid="y-axis"
      data-type={type}
      data-datakey={dataKey}
      data-tick={JSON.stringify(tick)}
      data-tickline={JSON.stringify(tickLine)}
      data-axisline={JSON.stringify(axisLine)}
    />
  ),
  CartesianGrid: ({ strokeDasharray, stroke, horizontal, vertical }: MockComponentProps) => (
    <div
      data-testid="cartesian-grid"
      data-strokedasharray={strokeDasharray}
      data-stroke={stroke}
      data-horizontal={horizontal}
      data-vertical={vertical}
    />
  ),
  Tooltip: ({ content, cursor }: MockComponentProps) => (
    <div data-testid="tooltip" data-cursor={JSON.stringify(cursor)} />
  ),
}));

describe('InsightUsageChart', () => {
  const mockInsightData = {
    totalGenerated: 1000,
    averageDuration: 250,
    successRate: 0.92,
    cacheHitRate: 0.85,
    byProvider: {
      openai: {
        total: 800,
        averageDuration: 220,
        successRate: 0.95,
        cacheHitRate: 0.88,
      },
      anthropic: {
        total: 200,
        averageDuration: 300,
        successRate: 0.9,
        cacheHitRate: 0.82,
      },
    },
  };

  describe('Render Tests', () => {
    it('renders without crashing', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByRole('region')).toBeDefined();
    });

    it('displays the chart title correctly', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByText('Insight Kullanım Dağılımı')).toBeDefined();
    });

    it('shows empty state message when no data is provided', () => {
      render(<InsightUsageChart data={undefined} />);
      expect(screen.getByText('Henüz insight kullanım verisi bulunmuyor')).toBeDefined();
    });

    it('renders all necessary chart components', () => {
      render(<InsightUsageChart data={mockInsightData} />);

      expect(screen.getByTestId('responsive-container')).toBeDefined();
      expect(screen.getByTestId('bar-chart')).toBeDefined();
      expect(screen.getByTestId('bar')).toBeDefined();
      expect(screen.getByTestId('x-axis')).toBeDefined();
      expect(screen.getByTestId('y-axis')).toBeDefined();
      expect(screen.getByTestId('cartesian-grid')).toBeDefined();
      expect(screen.getByTestId('tooltip')).toBeDefined();
    });

    it('displays total insights count', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByText('Toplam: 1.000')).toBeDefined();
    });
  });

  describe('Data Visualization', () => {
    it('correctly distributes insight usage data', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const barElement = screen.getByTestId('bar');
      const cells = screen.getAllByTestId('bar-cell');

      expect(cells.length).toBe(5); // nutrition, exercise, sleep, stress, general
      expect(barElement).toHaveAttribute('data-datakey', 'count');
    });

    it('applies correct layout for vertical bar chart', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-layout', 'vertical');
    });

    it('formats numbers using Turkish locale', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const totalText = screen.getByText('Toplam: 1.000');
      expect(totalText).toBeDefined();
    });
  });

  describe('Interactivity', () => {
    it('renders tooltip component for hover interactions', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toBeDefined();
      expect(tooltip).toHaveAttribute('data-cursor', JSON.stringify({ fill: '#F3F4F6' }));
    });

    it('applies proper styling to bars', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-radius', JSON.stringify([0, 4, 4, 0]));
      expect(bar).toHaveAttribute('data-barsize', '32');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<InsightUsageChart data={mockInsightData} />);
      const results = await axe(container);
      expect(results.violations.length).toBe(0);
    });

    it('uses correct ARIA attributes', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const chartRegion = screen.getByRole('region');
      expect(chartRegion).toHaveAttribute('aria-label', 'Insight kullanım grafiği');
    });
  });

  describe('Performance Metrics Display', () => {
    it('shows average duration correctly', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByText('250.0ms')).toBeDefined();
    });

    it('shows cache hit rate correctly', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByText('%85.0')).toBeDefined();
    });

    it('displays performance metrics in correct format', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      expect(screen.getByText('Ortalama Gecikme')).toBeDefined();
      expect(screen.getByText('Cache Hit Oranı')).toBeDefined();
    });
  });

  describe('Responsiveness', () => {
    it('applies responsive container classes', () => {
      render(<InsightUsageChart data={mockInsightData} />);
      const container = screen.getByTestId('responsive-container');
      expect(container.style.width).toBe('100%');
      expect(container.style.height).toBe('100%');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'custom-chart-class';
      const { container } = render(
        <InsightUsageChart data={mockInsightData} className={customClass} />
      );
      expect(container.firstChild).toHaveClass(customClass);
    });
  });
});
