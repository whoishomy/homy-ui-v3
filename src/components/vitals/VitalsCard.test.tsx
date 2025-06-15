import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
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
    jest.clearAllMocks();
  });

  it('renders all vital signs correctly', () => {
    renderComponent();

    // Check if all vital signs are rendered
    mockVitalsData.readings.forEach((reading) => {
      expect(screen.getByText(reading.type)).toBeInTheDocument();
      expect(screen.getByText(reading.value)).toBeInTheDocument();
      expect(screen.getByText(reading.unit)).toBeInTheDocument();
    });
  });

  it('displays correct status indicators', () => {
    renderComponent();

    // Check status indicators
    const elevatedReading = mockVitalsData.readings.find((r) => r.status === 'elevated');
    if (elevatedReading) {
      const statusIndicator = screen.getByTestId(`status-${elevatedReading.id}`);
      expect(statusIndicator).toHaveClass('elevated');
    }
  });

  it('shows trend arrows correctly', () => {
    renderComponent();

    // Check trend arrows
    mockVitalsData.readings.forEach((reading) => {
      const trendIndicator = screen.getByTestId(`trend-${reading.id}`);
      expect(trendIndicator).toHaveAttribute('data-trend', reading.trend);
    });
  });

  it('displays metadata correctly', () => {
    renderComponent();

    // Check metadata display
    expect(screen.getByText(mockVitalsData.metadata.source)).toBeInTheDocument();
    expect(screen.getByText(mockVitalsData.metadata.deviceId)).toBeInTheDocument();
    expect(screen.getByText(/Last updated/i)).toBeInTheDocument();
  });

  it('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    const onVitalClick = jest.fn();

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
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 600px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(1, 1fr)',
    });

    // Test desktop layout
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(min-width: 960px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(4, 1fr)',
    });
  });
});
