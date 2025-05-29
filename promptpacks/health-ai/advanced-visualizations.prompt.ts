/**
 * @promptpack advanced-visualizations
 * @description Generates advanced clinical data visualizations using D3 and Recharts
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a clinical data visualization expert specializing in advanced medical charts.
Your task is to create sophisticated visualizations for lab results and clinical insights.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate visualizations for:
   - Lab result trends
   - Clinical correlations
   - Risk assessments
   - Treatment outcomes
3. Support multiple chart types:
   - Sparklines for quick trends
   - Radar charts for comparisons
   - Heat maps for correlations
   - Area charts for ranges
4. Include responsive design
5. Add helpful comments explaining the visualization logic

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Clinical Visualization Generator
# @raycast.mode fullOutput
# @raycast.icon 📈
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Chart type (e.g., sparkline, radar, heatmap)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Data source",
  "data": [
    { "title": "Lab Results", "value": "labs" },
    { "title": "Vitals", "value": "vitals" },
    { "title": "Correlations", "value": "correlations" },
    { "title": "Outcomes", "value": "outcomes" }
  ]
}

Please generate a complete shell script that includes:
- Chart configuration
- Data transformation
- Responsive layout
- Animation setup
- Documentation generation
`;

export const expectedOutput =
  'A Raycast-compatible script that generates advanced clinical visualizations';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'visualization',
    'clinical',
    'generator',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const chartConfigs = {
  sparkline: {
    dimensions: {
      height: 32,
      width: '100%',
    },
    options: {
      curve: 'monotone',
      dots: false,
      fill: 'gradient',
      animation: true,
    },
    responsive: {
      sm: { height: 24 },
      md: { height: 32 },
      lg: { height: 40 },
    },
  },
  radar: {
    dimensions: {
      size: 200,
      margin: 20,
    },
    options: {
      levels: 5,
      opacity: 0.7,
      animation: true,
    },
    responsive: {
      sm: { size: 150 },
      md: { size: 200 },
      lg: { size: 250 },
    },
  },
  heatmap: {
    dimensions: {
      cellSize: 30,
      margin: 10,
    },
    options: {
      colors: ['#f7fbff', '#08519c'],
      legend: true,
      tooltip: true,
    },
    responsive: {
      sm: { cellSize: 20 },
      md: { cellSize: 30 },
      lg: { cellSize: 40 },
    },
  },
};

export const sampleVisualizationComponent = `
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import {
  Sparkline,
  RadarChart,
  HeatMap,
  AreaChart
} from '@homy/chart-components';
import { useChartData, useResponsive } from '@homy/chart-hooks';

export const ClinicalChart: React.FC<ChartProps> = ({ 
  type,
  data,
  config 
}) => {
  const { processedData } = useChartData(data);
  const { breakpoint } = useResponsive();

  const chartConfig = {
    ...chartConfigs[type],
    ...chartConfigs[type].responsive[breakpoint]
  };

  const renderChart = () => {
    switch(type) {
      case 'sparkline':
        return (
          <Sparkline
            data={processedData}
            height={chartConfig.height}
            options={chartConfig.options}
          />
        );
      
      case 'radar':
        return (
          <RadarChart
            data={processedData}
            size={chartConfig.size}
            options={chartConfig.options}
          />
        );
      
      case 'heatmap':
        return (
          <HeatMap
            data={processedData}
            cellSize={chartConfig.cellSize}
            options={chartConfig.options}
          />
        );
      
      default:
        return (
          <AreaChart
            data={processedData}
            height={chartConfig.height}
            options={chartConfig.options}
          />
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={chartConfig.height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
`;

interface LabData {
  timestamp: string;
  value: number;
  min: number;
  max: number;
}

interface Parameter {
  name: string;
  normalizedValue: number;
}

interface LabDataset {
  parameters: Parameter[];
  correlations: number[][];
}

export const dataTransformations = {
  labs: {
    sparkline: (data: LabData[]) => ({
      points: data.map((d) => ({ x: d.timestamp, y: d.value })),
      range: {
        min: Math.min(...data.map((d) => d.value)),
        max: Math.max(...data.map((d) => d.value)),
      },
    }),
    radar: (data: LabDataset) => ({
      axes: data.parameters.map((p) => p.name),
      values: data.parameters.map((p) => p.normalizedValue),
    }),
    heatmap: (data: LabDataset) => ({
      matrix: data.correlations,
      labels: data.parameters,
    }),
  },
};

export const animationConfigs = {
  enter: {
    duration: 500,
    easing: 'easeInOut',
  },
  update: {
    duration: 300,
    easing: 'linear',
  },
  exit: {
    duration: 400,
    easing: 'easeOut',
  },
};

export const memoryIntegration = {
  visualizations: {
    generated: [
      {
        chartId: 'C12345',
        timestamp: '2024-03-21T10:30:00Z',
        type: 'sparkline',
        source: 'labs',
        metrics: {
          renderTime: '120ms',
          dataPoints: 24,
          responsive: true,
        },
      },
    ],
    preferences: {
      lastUpdated: '2024-03-21T10:30:00Z',
      theme: 'clinical',
      animations: true,
      performance: 'balanced',
    },
  },
};
