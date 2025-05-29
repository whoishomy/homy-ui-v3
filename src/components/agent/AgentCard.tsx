import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import type { AgentRunnerStatus } from '../../types';

interface AgentCardProps {
  name: string;
  status: AgentRunnerStatus;
  onEnable: () => void;
  onDisable: () => void;
  onRun: () => void;
  onClick?: () => void;
  selected?: boolean;
}

const getStatusColor = (status: string): 'default' | 'success' | 'error' | 'warning' => {
  switch (status) {
    case 'running':
      return 'success';
    case 'error':
      return 'error';
    case 'idle':
      return 'default';
    default:
      return 'warning';
  }
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleString();
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  status,
  onEnable,
  onDisable,
  onRun,
  onClick,
  selected = false,
}) => {
  const isRunning = status.status === 'running';
  const hasError = status.status === 'error';

  return (
    <Card
      sx={{
        cursor: 'pointer',
        border: selected ? '2px solid primary.main' : 'none',
        '&:hover': {
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Chip label={status.status} color={getStatusColor(status.status)} size="small" />
        </Box>

        {hasError && (
          <Typography color="error" variant="body2" gutterBottom>
            {status.error}
          </Typography>
        )}

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Last Run: {formatDateTime(status.lastRun)}
          </Typography>
          {status.nextRun && (
            <Typography variant="body2" color="textSecondary">
              Next Run: {formatDateTime(status.nextRun)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Tooltip title={isRunning ? 'Stop Agent' : 'Start Agent'}>
          <IconButton
            color={isRunning ? 'error' : 'success'}
            onClick={(e) => {
              e.stopPropagation();
              isRunning ? onDisable() : onEnable();
            }}
          >
            {isRunning ? <StopIcon /> : <PlayIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Run Now">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onRun();
            }}
            disabled={isRunning}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        {status.nextRun && (
          <Tooltip title={`Scheduled: ${formatDateTime(status.nextRun)}`}>
            <IconButton disabled>
              <ScheduleIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};
