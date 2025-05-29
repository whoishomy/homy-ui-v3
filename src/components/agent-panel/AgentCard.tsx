import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Badge } from '@mui/material';
import { BrainCircuit, Activity, Database, Bot } from 'lucide-react';

type AgentStatus = 'active' | 'idle' | 'waiting';

interface AgentCardProps {
  name: string;
  status: AgentStatus;
  memoryCount: number;
  model: string;
  lastExecuted?: string;
  icon?: 'insight' | 'lab' | 'triage' | 'dashboard';
}

const getStatusColor = (status: AgentStatus): string => {
  const colors = {
    active: '#4CAF50',
    idle: '#9E9E9E',
    waiting: '#FFC107',
  };
  return colors[status];
};

const getAgentIcon = (type: AgentCardProps['icon']) => {
  const icons = {
    insight: BrainCircuit,
    lab: Activity,
    triage: Database,
    dashboard: Bot,
  };
  return icons[type || 'insight'];
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  status,
  memoryCount,
  model,
  lastExecuted,
  icon,
}) => {
  const IconComponent = getAgentIcon(icon);

  return (
    <Card
      sx={{
        minWidth: 275,
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: getStatusColor(status),
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconComponent size={24} />
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Chip
            size="small"
            label={status.toUpperCase()}
            sx={{
              backgroundColor: getStatusColor(status),
              color: 'white',
              ml: 'auto',
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Memory Logs
            </Typography>
            <Badge badgeContent={memoryCount} color="primary">
              <Database size={16} />
            </Badge>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Model
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {model}
            </Typography>
          </Box>

          {lastExecuted && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Last Executed
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {lastExecuted}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
