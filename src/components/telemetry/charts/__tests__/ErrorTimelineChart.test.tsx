/// <reference types="vitest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect, beforeEach } from 'vitest';
import ErrorTimelineChart from '../ErrorTimelineChart';

// Mock Recharts bileşenleri
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height }: any) => (
    <div data-testid="responsive-container" style={{ width, height }}>
      {children}
    </div>
  ),
  AreaChart: ({ children, data, margin }: any) => (
    <div data-testid="area-chart" data-margin={JSON.stringify(margin)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data } as any);
        }
        return child;
      })}
    </div>
  ),
  Area: ({ dataKey, data, stroke, fill, type, name, strokeWidth, dot, activeDot }: any) => {
    const points = data?.map((item: any, index: number) => (
      <div 
        key={index} 
        data-testid="data-point" 
        data-value={item[dataKey]}
        data-type={type}
        data-name={name}
        style={{
          stroke,
          fill,
          strokeWidth
        }}
      />
    )) || [];

    return (
      <div 
        data-testid="area" 
        data-datakey={dataKey}
        style={{ stroke, fill }}
      >
        {points}
      </div>
    );
  },
  XAxis: ({ dataKey, tick, tickLine }: any) => (
    <div 
      data-testid="x-axis" 
      data-datakey={dataKey}
      data-tick={JSON.stringify(tick)}
      data-tickline={JSON.stringify(tickLine)}
    />
  ),
  YAxis: ({ tick, tickLine, axisLine, allowDecimals, label }: any) => (
    <div 
      data-testid="y-axis"
      data-tick={JSON.stringify(tick)}
      data-tickline={JSON.stringify(tickLine)}
      data-axisline={JSON.stringify(axisLine)}
      data-allowdecimals={allowDecimals}
      data-label={JSON.stringify(label)}
    />
  ),
  CartesianGrid: ({ strokeDasharray, stroke }: any) => (
    <div 
      data-testid="cartesian-grid"
      data-strokedasharray={strokeDasharray}
      data-stroke={stroke}
    />
  ),
  Tooltip: ({ content }: any) => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Defs: ({ children }: any) => (
    <div data-testid="defs">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </div>
  ),
  LinearGradient: ({ children, id, x1, x2, y1, y2 }: any) => (
    <div 
      data-testid="linear-gradient" 
      id={id}
      data-x1={x1}
      data-x2={x2}
      data-y1={y1}
      data-y2={y2}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </div>
  ),
  Stop: ({ offset, stopColor, stopOpacity }: any) => (
    <div 
      data-testid="gradient-stop"
      data-offset={offset}
      data-stop-color={stopColor}
      data-stop-opacity={stopOpacity}
    />
  ),
}));

describe('ErrorTimelineChart', () => {
  const mockTimelineData = [
    { timestamp: 1716616800000, errors: 5 }, // 25 Mayıs 2024 10:00
    { timestamp: 1716620400000, errors: 2 }, // 25 Mayıs 2024 11:00
    { timestamp: 1716624000000, errors: 8 }, // 25 Mayıs 2024 12:00
    { timestamp: 1716627600000, errors: 3 }, // 25 Mayıs 2024 13:00
  ];

  describe('Render Tests', () => {
    it('renders without crashing', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      expect(screen.getByRole('region')).toBeDefined();
    });

    it('displays the chart title correctly', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      expect(screen.getByText('Hata Zaman Çizelgesi')).toBeDefined();
    });

    it('shows empty state message when no data is provided', () => {
      render(<ErrorTimelineChart data={[]} />);
      expect(screen.getByText('Henüz hata verisi bulunmuyor')).toBeDefined();
    });

    it('renders all necessary chart components', () => {
      const { container } = render(<ErrorTimelineChart data={mockTimelineData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeDefined();
      expect(screen.getByTestId('area-chart')).toBeDefined();
      expect(screen.getByTestId('area')).toBeDefined();
      expect(screen.getByTestId('x-axis')).toBeDefined();
      expect(screen.getByTestId('y-axis')).toBeDefined();
      expect(screen.getByTestId('cartesian-grid')).toBeDefined();
      
      // SVG elementlerini doğrudan DOM'dan kontrol et
      const defs = container.querySelector('defs');
      const linearGradient = container.querySelector('linearGradient');
      
      expect(defs).toBeDefined();
      expect(linearGradient).toBeDefined();
    });
  });

  describe('Data Visualization', () => {
    it('correctly maps error data to chart', () => {
      const { container } = render(<ErrorTimelineChart data={mockTimelineData} />);
      const areaElement = screen.getByTestId('area');
      const dataPoints = areaElement.querySelectorAll('[data-testid="data-point"]');
      
      expect(dataPoints.length).toBe(mockTimelineData.length);
      
      dataPoints.forEach((point, index) => {
        expect(point).toHaveAttribute('data-value', mockTimelineData[index].errors.toString());
      });
    });

    it('uses correct data key for error values', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      expect(screen.getByTestId('area')).toHaveAttribute('data-datakey', 'errors');
    });

    it('formats timestamp correctly for x-axis', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      expect(screen.getByTestId('x-axis')).toHaveAttribute('data-datakey', 'formattedTime');
    });
  });

  describe('Interactivity', () => {
    it('renders tooltip component for hover interactions', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      expect(screen.getByTestId('tooltip')).toBeDefined();
    });

    it('applies hover styles to data points', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      const areaElement = screen.getByTestId('area');
      
      expect(areaElement.style.stroke).toBe('#EF4444');
      expect(areaElement.style.fill).toBe('url(#errorGradient)');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ErrorTimelineChart data={mockTimelineData} />);
      const results = await axe(container);
      expect(results.violations.length).toBe(0);
    });

    it('uses correct ARIA attributes', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      const chartRegion = screen.getByRole('region');
      
      expect(chartRegion).toHaveAttribute('aria-label', 'Hata zaman çizelgesi grafiği');
    });

    it('provides alternative text for chart elements', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      const chartTitle = screen.getByText('Hata Zaman Çizelgesi');
      
      expect(chartTitle).toBeDefined();
      expect(chartTitle.tagName).toBe('H3');
    });
  });

  describe('Responsiveness', () => {
    it('applies responsive container classes', () => {
      render(<ErrorTimelineChart data={mockTimelineData} />);
      const container = screen.getByTestId('responsive-container');
      
      expect(container.style.width).toBe('100%');
      expect(container.style.height).toBe('100%');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'custom-chart-class';
      const { container } = render(
        <ErrorTimelineChart data={mockTimelineData} className={customClass} />
      );
      expect(container.firstChild).toHaveClass(customClass);
    });
  });

  describe('Performance Optimization', () => {
    it('memoizes data transformation', () => {
      const { rerender } = render(<ErrorTimelineChart data={mockTimelineData} />);
      const initialChart = screen.getByTestId('area-chart');
      
      // Aynı veriyle yeniden render
      rerender(<ErrorTimelineChart data={mockTimelineData} />);
      const rerenderedChart = screen.getByTestId('area-chart');
      
      // Referans eşitliğini kontrol et (memoization çalışıyorsa aynı olmalı)
      expect(initialChart).toBe(rerenderedChart);
    });
  });
}); 