import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Brain, Activity, AlertTriangle, ArrowRight } from 'lucide-react';

interface MemoryEntry {
  component: string;
  source: string;
  insight: string;
  action?: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp?: string;
}

interface MemoryLogTimelineProps {
  entries: MemoryEntry[];
}

const getSeverityColor = (severity: MemoryEntry['severity'] = 'low') => {
  const colors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336',
  };
  return colors[severity];
};

const getSourceIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case 'claude':
      return <Brain size={16} />;
    case 'gpt-4':
      return <Activity size={16} />;
    default:
      return <AlertTriangle size={16} />;
  }
};

export const MemoryLogTimeline: React.FC<MemoryLogTimelineProps> = ({ entries }) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Brain size={20} />
        <Typography variant="h6">System Memory Log</Typography>
      </Box>

      <Timeline>
        {entries.map((entry, index) => (
          <TimelineItem key={`${entry.component}-${index}`}>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: getSeverityColor(entry.severity),
                  p: 1,
                }}
              >
                {getSourceIcon(entry.source)}
              </TimelineDot>
              {index < entries.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                  }}
                >
                  {entry.component}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      backgroundColor: 'action.hover',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    {entry.source}
                  </Typography>
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ArrowRight size={16} />
                  {entry.insight}
                </Typography>

                {entry.action && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color: getSeverityColor(entry.severity),
                      fontWeight: 'medium',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Activity size={16} />
                    {entry.action}
                  </Typography>
                )}

                {entry.timestamp && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'block',
                      color: 'text.secondary',
                      fontFamily: 'monospace',
                    }}
                  >
                    {entry.timestamp}
                  </Typography>
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};
