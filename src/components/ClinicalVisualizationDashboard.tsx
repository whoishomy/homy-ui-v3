import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

interface LabTrend {
  timestamp: string;
  value: number;
}

interface Parameter {
  name: string;
  normalizedValue: number;
}

interface LabData {
  trends: LabTrend[];
  correlations: {
    matrix: number[][];
    labels: string[];
  };
  parameters: {
    axes: string[];
    values: number[];
  };
}

interface DashboardProps {
  labData: LabData;
  patientId: string;
}

interface ChartConfig {
  theme: 'clinical' | 'dark' | 'light';
  animations: boolean;
  performance: 'balanced' | 'performance' | 'quality';
}

const ClinicalVisualizationDashboard: React.FC<DashboardProps> = ({ labData, patientId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartConfigs, setChartConfigs] = useState<ChartConfig>({
    theme: 'clinical',
    animations: true,
    performance: 'balanced',
  });

  useEffect(() => {
    // Load preferences from memory.json
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/ai/memory');
        const data = await response.json();
        if (data.visualizations?.preferences) {
          setChartConfigs(data.visualizations.preferences);
        }
      } catch (error) {
        console.error('Failed to load visualization preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const renderChartSection = (
    title: string,
    type: 'sparkline' | 'radar' | 'heatmap',
    data: any
  ) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 200 }}>
        {/* Temporarily using a placeholder div until we implement the chart components */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {type} Chart: {title}
        </div>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clinical Insights Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {renderChartSection('Lab Result Trends', 'sparkline', labData.trends)}
          </Box>

          <Box sx={{ flex: 1 }}>
            {renderChartSection('Parameter Correlations', 'heatmap', labData.correlations)}
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          {renderChartSection('Parameter Overview', 'radar', labData.parameters)}
        </Box>
      </Box>
    </Box>
  );
};

export default ClinicalVisualizationDashboard;
