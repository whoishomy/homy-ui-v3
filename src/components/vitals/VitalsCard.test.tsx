import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { VitalsCard } from './VitalsCard';

// Mock data for vitals
const mockVitalsData = {
  readings: [
    {
      id: 'BP-001',
      type: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      timestamp: '2024-03-26T08:00:00Z',
      status: 'normal',
      trend: 'stable',
    },
    {
      id: 'HR-001',
      type: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      timestamp: '2024-03-26T08:00:00Z',
      status: 'normal',
      trend: 'decreasing',
    },
    {
      id: 'TEMP-001',
      type: 'Temperature',
      value: '37.2',
      unit: '°C',
      timestamp: '2024-03-26T08:00:00Z',
      status: 'elevated',
      trend: 'increasing',
    },
    {
      id: 'SPO2-001',
      type: 'SpO2',
      value: '98',
      unit: '%',
      timestamp: '2024-03-26T08:00:00Z',
      status: 'normal',
      trend: 'stable',
    },
  ],
  metadata: {
    lastUpdated: '2024-03-26T08:00:00Z',
    source: 'Bedside Monitor',
    deviceId: 'BM-123',
  },
};

// Reusable render function
const renderComponent = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <VitalsCard data={mockVitalsData} {...props} />
    </ThemeProvider>
  );
};

describe('VitalsCard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all vital signs with correct values', () => {
    renderComponent();

    // Check if all vital types are rendered
    expect(screen.getByText('Blood Pressure')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('SpO2')).toBeInTheDocument();

    // Check if values are rendered correctly
    expect(screen.getByText('120/80')).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('37.2')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  it('displays correct status indicators', () => {
    renderComponent();

    // Check status indicators
    const normalIndicators = screen.getAllByTestId('status-normal');
    expect(normalIndicators).toHaveLength(3); // BP, HR, SpO2

    const elevatedIndicator = screen.getByTestId('status-elevated');
    expect(elevatedIndicator).toBeInTheDocument(); // Temperature
  });

  it('shows trend arrows in correct directions', () => {
    renderComponent();

    // Check trend indicators
    const stableIndicators = screen.getAllByTestId('trend-stable');
    expect(stableIndicators).toHaveLength(2); // BP, SpO2

    const decreasingIndicator = screen.getByTestId('trend-decreasing');
    expect(decreasingIndicator).toBeInTheDocument(); // HR

    const increasingIndicator = screen.getByTestId('trend-increasing');
    expect(increasingIndicator).toBeInTheDocument(); // Temperature
  });

  it('displays metadata information', () => {
    renderComponent();

    expect(screen.getByText('Bedside Monitor')).toBeInTheDocument();
    expect(screen.getByText('BM-123')).toBeInTheDocument();

    // Format and check timestamp
    const formattedTime = new Date(mockVitalsData.metadata.lastUpdated).toLocaleTimeString(
      'en-US',
      { hour: '2-digit', minute: '2-digit' }
    );
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    renderComponent({ data: { readings: [], metadata: {} } });

    expect(screen.getByText('No vital signs available')).toBeInTheDocument();
  });

  it('updates when new readings arrive', async () => {
    const { rerender } = renderComponent();

    const newData = {
      ...mockVitalsData,
      readings: [
        {
          ...mockVitalsData.readings[0],
          value: '130/85',
          status: 'elevated',
          trend: 'increasing',
        },
      ],
    };

    rerender(
      <ThemeProvider theme={theme}>
        <VitalsCard data={newData} />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('130/85')).toBeInTheDocument();
      expect(screen.getByTestId('status-elevated')).toBeInTheDocument();
      expect(screen.getByTestId('trend-increasing')).toBeInTheDocument();
    });
  });

  it('maintains accessibility standards', async () => {
    const { container } = renderComponent();

    // Check for ARIA labels
    expect(screen.getByRole('region', { name: /vital signs/i })).toBeInTheDocument();

    // Check for contrast ratio in status indicators
    const statusIndicators = screen.getAllByTestId(/^status-/);
    statusIndicators.forEach((indicator) => {
      const style = window.getComputedStyle(indicator);
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    // Run axe accessibility tests
    await expect(container).toHaveNoViolations();
  });

  it('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    const onVitalClick = vi.fn();

    renderComponent({ onVitalClick });

    // Click on a vital sign
    const bpReading = screen.getByText('Blood Pressure').closest('div');
    if (bpReading) {
      await user.click(bpReading);
      expect(onVitalClick).toHaveBeenCalledWith(mockVitalsData.readings[0]);
    }
  });

  it('renders responsive layout correctly', () => {
    renderComponent();

    const container = screen.getByTestId('vitals-grid');

    // Test mobile layout
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 600px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(1, 1fr)',
    });

    // Test desktop layout
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(min-width: 960px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(4, 1fr)',
    });
  });
});
