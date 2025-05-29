import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ClinicalVisualizationDashboard from '../ClinicalVisualizationDashboard';
import { vi, expect, describe, it, beforeEach } from 'vitest';

// Add type for mediaQueryCallback
type MediaQueryCallback = (e: { matches: boolean }) => void;

const mockLabData = {
  trends: [
    { timestamp: '2024-03-21T10:00:00Z', value: 15.5 },
    { timestamp: '2024-03-21T11:00:00Z', value: 14.8 },
    { timestamp: '2024-03-21T12:00:00Z', value: 15.2 },
  ],
  correlations: {
    matrix: [
      [1, 0.8],
      [0.8, 1],
    ],
    labels: ['WBC', 'HGB'],
  },
  parameters: {
    axes: ['WBC', 'HGB', 'PLT'],
    values: [0.8, 0.6, 0.9],
  },
};

const theme = createTheme({
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
});

const renderDashboard = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <ClinicalVisualizationDashboard labData={mockLabData} patientId="TEST-001" {...props} />
    </ThemeProvider>
  );
};

describe('ClinicalVisualizationDashboard', () => {
  beforeEach(() => {
    // Mock fetch for memory.json
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            visualizations: {
              preferences: {
                theme: 'clinical',
                animations: true,
                performance: 'balanced',
              },
            },
          }),
      })
    );
  });

  it('renders all chart sections with correct data', () => {
    renderDashboard();

    // Check main title
    expect(screen.getByText('Clinical Insights Dashboard')).toBeInTheDocument();

    // Check chart sections
    const sections = [
      { title: 'Lab Result Trends', type: 'sparkline' },
      { title: 'Parameter Correlations', type: 'heatmap' },
      { title: 'Parameter Overview', type: 'radar' },
    ];

    sections.forEach(({ title, type }) => {
      const section = screen.getByText(title);
      expect(section).toBeInTheDocument();
      expect(screen.getByText(`${type} Chart: ${title}`)).toBeInTheDocument();
    });
  });

  it('loads and applies visualization preferences from memory.json', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/memory');
    });

    // Verify the preferences were loaded
    const mockPreferences = {
      theme: 'clinical',
      animations: true,
      performance: 'balanced',
    };

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const response = await (global.fetch as jest.Mock).mock.results[0].value;
    const data = await response.json();
    expect(data.visualizations.preferences).toEqual(mockPreferences);
  });

  it('handles mobile layout correctly', () => {
    // Mock mobile viewport
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === '(max-width:600px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    renderDashboard();

    // Check if the layout container has the correct flex direction
    const flexContainer = screen.getByText('Lab Result Trends').closest('div')?.parentElement;

    expect(flexContainer).toHaveStyle({
      flexDirection: 'column',
    });
  });

  it('handles API error gracefully and maintains UI', async () => {
    const consoleError = vi.spyOn(console, 'error');
    (global.fetch as jest.Mock).mockImplementation(() => Promise.reject('API Error'));

    renderDashboard();

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to load visualization preferences:',
        'API Error'
      );
    });

    // Verify UI is still intact
    expect(screen.getByText('Clinical Insights Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Lab Result Trends')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('maintains responsive layout on window resize', () => {
    // Mock mobile viewport
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === '(max-width:600px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderDashboard();

    // Check if the layout container has the correct flex direction for mobile
    const flexContainer = screen.getByText('Lab Result Trends').closest('div')?.parentElement;

    expect(flexContainer).toHaveStyle({
      flexDirection: 'column',
    });

    // Mock desktop viewport
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query !== '(max-width:600px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Re-render to trigger layout update
    renderDashboard();

    // Check if the layout container has the correct flex direction for desktop
    const desktopContainer = screen.getByText('Lab Result Trends').closest('div')?.parentElement;

    expect(desktopContainer).toHaveStyle({
      flexDirection: 'row',
    });
  });
});
