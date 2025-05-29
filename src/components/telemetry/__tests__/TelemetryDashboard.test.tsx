/// <reference types="vitest" />
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TelemetryDashboard } from '../TelemetryDashboard';
import { useTelemetryFeed } from '@/hooks/useTelemetryFeed';

// Mock the useTelemetryFeed hook
vi.mock('@/hooks/useTelemetryFeed');

// Mock the chart components
vi.mock('../charts/ErrorTimelineChart', () => ({
  default: vi.fn(({ data }: any) => {
    if (data === 'throw') {
      throw new Error('Chart failed to render');
    }
    return (
      <div 
        data-testid="error-timeline-chart" 
        data-data={JSON.stringify(data)}
        role="region"
        aria-label="Hata zaman çizelgesi"
        tabIndex={0}
      >
        <h3 className="sr-only">Hata Zaman Çizelgesi</h3>
        Error Timeline Chart
      </div>
    );
  }),
}));

vi.mock('../charts/InsightUsageChart', () => ({
  default: vi.fn(({ data }: any) => (
    <div 
      data-testid="insight-usage-chart" 
      data-data={JSON.stringify(data)}
      role="region"
      aria-label="Insight kullanım grafiği"
      tabIndex={0}
    >
      <h3 className="sr-only">Insight Kullanım Grafiği</h3>
      Insight Usage Chart
    </div>
  )),
}));

vi.mock('../charts/FallbackRateChart', () => ({
  default: vi.fn(({ data }: any) => (
    <div 
      data-testid="fallback-rate-chart" 
      data-data={JSON.stringify(data)}
      role="region"
      aria-label="Fallback oranı grafiği"
      tabIndex={0}
    >
      <h3 className="sr-only">Fallback Oranı Grafiği</h3>
      Fallback Rate Chart
    </div>
  )),
}));

vi.mock('../panels/ProviderStatusPanel', () => ({
  default: vi.fn(({ providers }: any) => (
    <div 
      data-testid="provider-status-panel" 
      data-providers={JSON.stringify(providers)}
      role="region"
      aria-label="Sağlayıcı durumu paneli"
      tabIndex={0}
    >
      <h3 className="sr-only">Sağlayıcı Durumu Paneli</h3>
      Provider Status Panel
    </div>
  )),
}));

describe('TelemetryDashboard Integration', () => {
  const mockSnapshot = {
    providers: {
      openai: {
        health: 98,
        latency: 250,
        errorRate: 0.02,
        successRate: 0.98,
        totalRequests: 1000,
      },
      anthropic: {
        health: 95,
        latency: 300,
        errorRate: 0.05,
        successRate: 0.95,
        totalRequests: 800,
      },
    },
    errorTimeline: [
      { timestamp: 1716616800000, errors: 5 },
      { timestamp: 1716620400000, errors: 2 },
    ],
    insights: {
      totalGenerated: 1000,
      averageLatency: 250,
      cacheHitRate: 0.85,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTelemetryFeed as any).mockReturnValue({
      snapshot: mockSnapshot,
      error: null,
      isLoading: false,
    });
  });

  describe('Initial Render', () => {
    it('renders all chart components with correct data', async () => {
      render(<TelemetryDashboard />);

      await waitFor(() => {
        const errorChart = screen.getByTestId('error-timeline-chart');
        const insightChart = screen.getByTestId('insight-usage-chart');
        const fallbackChart = screen.getByTestId('fallback-rate-chart');
        const providerPanel = screen.getByTestId('provider-status-panel');

        expect(errorChart).toHaveAttribute('data-data', JSON.stringify(mockSnapshot.errorTimeline));
        expect(insightChart).toHaveAttribute('data-data', JSON.stringify(mockSnapshot.insights));
        expect(fallbackChart).toHaveAttribute('data-data', JSON.stringify(mockSnapshot.providers));
        expect(providerPanel).toHaveAttribute('data-providers', JSON.stringify(mockSnapshot.providers));
      });
    });

    it('shows loading state for all components', async () => {
      (useTelemetryFeed as any).mockReturnValue({
        snapshot: null,
        error: null,
        isLoading: true,
      });

      render(<TelemetryDashboard />);
      
      const loadingPanels = screen.getAllByTestId('loading-panel');
      expect(loadingPanels).toHaveLength(4); // Provider panel + 3 charts
    });

    it('shows error state when feed fails', () => {
      const mockError = new Error('Failed to fetch telemetry data');
      (useTelemetryFeed as any).mockReturnValue({
        snapshot: null,
        error: mockError,
        isLoading: false,
      });

      render(<TelemetryDashboard />);
      expect(screen.getByText(/telemetri verisi alınamadı/i)).toBeInTheDocument();
    });
  });

  describe('Data Updates', () => {
    it('updates components when snapshot changes', async () => {
      const { rerender } = render(<TelemetryDashboard />);

      const updatedSnapshot = {
        ...mockSnapshot,
        errorTimeline: [
          ...mockSnapshot.errorTimeline,
          { timestamp: 1716624000000, errors: 8 },
        ],
      };

      await act(async () => {
        (useTelemetryFeed as any).mockReturnValue({
          snapshot: updatedSnapshot,
          error: null,
          isLoading: false,
        });

        rerender(<TelemetryDashboard />);
      });

      await waitFor(() => {
        const errorChart = screen.getByTestId('error-timeline-chart');
        expect(errorChart).toHaveAttribute('data-data', JSON.stringify(updatedSnapshot.errorTimeline));
      });
    });

    it('handles refresh interval prop changes', async () => {
      const { rerender } = render(<TelemetryDashboard refreshInterval={5000} />);
      
      await act(async () => {
        rerender(<TelemetryDashboard refreshInterval={10000} />);
      });
      
      expect(useTelemetryFeed).toHaveBeenCalledWith({ refreshInterval: 10000 });
    });
  });

  describe('Layout & Responsiveness', () => {
    it('applies grid layout classes correctly', () => {
      const { container } = render(<TelemetryDashboard />);
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'custom-dashboard';
      const { container } = render(<TelemetryDashboard className={customClass} />);
      expect(container.firstChild).toHaveClass(customClass);
    });
  });

  describe('Error Boundaries', () => {
    it('isolates component failures', async () => {
      (useTelemetryFeed as any).mockReturnValue({
        snapshot: {
          ...mockSnapshot,
          errorTimeline: 'throw',
        },
        error: null,
        isLoading: false,
      });

      render(<TelemetryDashboard />);

      await waitFor(() => {
        // Other components should still render
        expect(screen.getByTestId('insight-usage-chart')).toBeInTheDocument();
        expect(screen.getByTestId('fallback-rate-chart')).toBeInTheDocument();
        expect(screen.getByTestId('provider-status-panel')).toBeInTheDocument();

        // Error boundary should catch and display error
        expect(screen.getByText(/bir hata oluştu/i)).toBeInTheDocument();
        expect(screen.getByText(/chart failed to render/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<TelemetryDashboard />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-timeline-chart')).toBeInTheDocument();
      });

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false }, // Disable color contrast checks
          'region': { enabled: false }, // Disable region landmark checks
        },
      });

      if (results.violations.length > 0) {
        console.log('Accessibility violations:', results.violations);
      }

      expect(results.violations.length).toBe(0);
    });

    it('uses correct heading structure', async () => {
      render(<TelemetryDashboard />);
      
      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 2 });
        expect(mainHeading).toHaveTextContent(/telemetri kontrol paneli/i);

        // Check for section headings
        const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
        expect(sectionHeadings).toHaveLength(4); // One for each chart/panel
      });
    });

    it('preserves tab order', async () => {
      render(<TelemetryDashboard />);
      
      await waitFor(() => {
        const elements = screen.getAllByRole('region');
        elements.forEach((element, index) => {
          if (index > 0) {
            expect(element).toHaveAttribute('tabIndex', '0');
          }
        });
      });
    });
  });
}); 