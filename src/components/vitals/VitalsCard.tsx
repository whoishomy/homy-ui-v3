import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  MonitorHeart as BPIcon,
  Thermostat as TempIcon,
  Air as RespiratoryIcon,
  Warning as AlertIcon,
} from '@mui/icons-material';
import { agentRunner } from '../../agent-runner';
import type { VitalSigns, VitalInsight, VitalStatus, VitalTrend } from '../../types/vitals';

interface VitalsCardProps {
  patientId: string;
  onInsightGenerated?: (insight: VitalInsight) => void;
}

interface VitalIndicatorProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: string;
  status: VitalStatus;
  trend?: VitalTrend;
}

const getStatusColor = (status: VitalStatus): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'critical':
      return 'error';
    case 'high':
    case 'low':
      return 'warning';
    case 'normal':
    default:
      return 'success';
  }
};

const VitalIndicator: React.FC<VitalIndicatorProps> = ({
  icon,
  label,
  value,
  unit,
  status,
  trend,
}) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <IconButton color={getStatusColor(status)} size="large">
      {icon}
    </IconButton>
    <Typography variant="h6" component="div">
      {value !== null ? `${value} ${unit}` : '--'}
    </Typography>
    <Typography color="text.secondary" variant="body2">
      {label}
    </Typography>
    {trend && (
      <Chip
        size="small"
        label={trend}
        color={trend === 'rising' ? 'error' : trend === 'falling' ? 'warning' : 'success'}
        sx={{ mt: 1 }}
      />
    )}
  </Box>
);

export const VitalsCard: React.FC<VitalsCardProps> = ({ patientId, onInsightGenerated }) => {
  const [vitals, setVitals] = useState<VitalSigns | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVitals = async () => {
      try {
        const result = await agentRunner.runAgent('vitals-monitor', { data: { patientId } });
        if (result.success && result.data) {
          setVitals(result.data.vitals);
          if (onInsightGenerated && Array.isArray(result.data.insights)) {
            result.data.insights.forEach((insight) => {
              const fullInsight: VitalInsight = {
                timestamp: new Date().toISOString(),
                status: 'normal',
                type: insight.type as 'alert' | 'warning' | 'info',
                severity: insight.severity,
                trends: [],
                recommendations: [],
                description: insight.description,
                suggestedActions: insight.suggestedActions,
              };
              onInsightGenerated(fullInsight);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load vital signs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVitals();
  }, [patientId, onInsightGenerated]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader title="Vital Signs Monitor" />
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <VitalIndicator
                icon={<HeartIcon />}
                label="Heart Rate"
                value={vitals?.heartRate ?? null}
                unit="bpm"
                status={vitals?.heartRateStatus ?? 'normal'}
                trend={vitals?.heartRateTrend}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <VitalIndicator
                icon={<BPIcon />}
                label="Blood Pressure"
                value={vitals?.systolicBP ?? null}
                unit="mmHg"
                status={vitals?.bpStatus ?? 'normal'}
                trend={vitals?.bpTrend}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <VitalIndicator
                icon={<TempIcon />}
                label="Temperature"
                value={vitals?.temperature ?? null}
                unit="°F"
                status={vitals?.temperatureStatus ?? 'normal'}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <VitalIndicator
                icon={<RespiratoryIcon />}
                label="Respiratory Rate"
                value={vitals?.respiratoryRate ?? null}
                unit="bpm"
                status={vitals?.respiratoryStatus ?? 'normal'}
                trend={vitals?.respiratoryTrend}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
