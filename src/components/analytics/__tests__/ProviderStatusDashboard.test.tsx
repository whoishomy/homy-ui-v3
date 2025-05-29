import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProviderStatusDashboard } from '../ProviderStatusDashboard';
import { InsightEngine } from '@/services/insightEngine';

// Mock the InsightEngine
vi.mock('@/services/insightEngine', () => ({
  InsightEngine: {
    getInstance: () => ({
      getProviderHealth: vi.fn().mockReturnValue({
        openai: {
          healthScore: 95,
          averageLatency: 250,
          errorRate: 0.02,
          successRate: 0.98,
          totalRequests: 1000,
        },
      }),
      getTelemetrySnapshot: vi.fn().mockReturnValue({
        insights: {
          totalGenerated: 1000,
          averageLatency: 300,
          cacheHitRate: 0.8,
        },
        cache: {
          hitRate: 0.8,
        },
      }),
      getErrorStats: vi.fn().mockReturnValue({
        timeline: [
          { timestamp: Date.now() - 3600000, count: 5 },
          { timestamp: Date.now(), count: 2 },
        ],
      }),
    }),
  },
}));

describe('ProviderStatusDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<ProviderStatusDashboard providerId="openai" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays provider health metrics', async () => {
    render(<ProviderStatusDashboard providerId="openai" />);

    await waitFor(() => {
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();
      expect(screen.getByText('2.0%')).toBeInTheDocument();
    });
  });

  it('shows correct status badge for healthy provider', async () => {
    render(<ProviderStatusDashboard providerId="openai" />);

    await waitFor(() => {
      const badge = screen.getByLabelText('Status: Operational');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-500');
    });
  });

  it('updates metrics periodically', async () => {
    const { rerender } = render(<ProviderStatusDashboard providerId="openai" />);

    // Fast-forward time
    vi.advanceTimersByTime(5000);

    // Mock updated values
    vi.mocked(InsightEngine.getInstance().getProviderHealth).mockReturnValueOnce({
      openai: {
        healthScore: 85,
        averageLatency: 300,
        errorRate: 0.05,
        successRate: 0.95,
        totalRequests: 1200,
      },
    });

    rerender(<ProviderStatusDashboard providerId="openai" />);

    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('300ms')).toBeInTheDocument();
      expect(screen.getByText('5.0%')).toBeInTheDocument();
    });
  });

  it('handles error state gracefully', async () => {
    vi.mocked(InsightEngine.getInstance().getProviderHealth).mockImplementationOnce(() => {
      throw new Error('Failed to fetch metrics');
    });

    render(<ProviderStatusDashboard providerId="openai" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch metrics/)).toBeInTheDocument();
    });
  });
}); 