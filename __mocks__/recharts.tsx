import React from 'react';

interface MockChartProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const MockChartComponent = ({ children, ...props }: MockChartProps): JSX.Element => (
  <div data-testid="recharts-mock" {...props}>
    {children}
  </div>
);

// Chart containers
export const ResponsiveContainer = MockChartComponent;
export const BarChart = MockChartComponent;
export const LineChart = MockChartComponent;
export const PieChart = MockChartComponent;
export const AreaChart = MockChartComponent;
export const ComposedChart = MockChartComponent;
export const ScatterChart = MockChartComponent;
export const RadarChart = MockChartComponent;

// Chart elements
export const Bar = MockChartComponent;
export const Line = MockChartComponent;
export const Area = MockChartComponent;
export const Pie = MockChartComponent;
export const Scatter = MockChartComponent;
export const Radar = MockChartComponent;

// Axis components
export const XAxis = MockChartComponent;
export const YAxis = MockChartComponent;
export const ZAxis = MockChartComponent;
export const CartesianGrid = MockChartComponent;
export const PolarGrid = MockChartComponent;
export const RadialGrid = MockChartComponent;

// Other components
export const Legend = MockChartComponent;
export const Tooltip = MockChartComponent;
export const Cell = MockChartComponent;
export const Label = MockChartComponent;
export const LabelList = MockChartComponent;
export const ReferenceLine = MockChartComponent;
export const ReferenceDot = MockChartComponent;
export const ReferenceArea = MockChartComponent;
export const ErrorBar = MockChartComponent;
export const Brush = MockChartComponent;

// Shapes
export const Rectangle = MockChartComponent;
export const Polygon = MockChartComponent;
export const Cross = MockChartComponent;
export const Dot = MockChartComponent;
export const Square = MockChartComponent;
export const Star = MockChartComponent;
export const Triangle = MockChartComponent;
export const Wye = MockChartComponent;

// Utilities
export const Surface = MockChartComponent;
export const Symbols = MockChartComponent;
export const Layer = MockChartComponent;
