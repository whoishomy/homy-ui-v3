import React from 'react';

// Mock for recharts components
export const LineChart = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="line-chart">{children}</div>
);

export const Line = () => <div data-testid="chart-line" />;
export const XAxis = () => <div data-testid="x-axis" />;
export const YAxis = () => <div data-testid="y-axis" />;
export const Tooltip = () => <div data-testid="tooltip" />;
export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="responsive-container">{children}</div>
);
export const ReferenceLine = () => <div data-testid="reference-line" />;
