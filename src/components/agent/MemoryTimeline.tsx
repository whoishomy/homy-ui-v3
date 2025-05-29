import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Paper, Typography, Box } from '@mui/material';
import type { MemoryEntry } from '../../types';

interface MemoryTimelineProps {
  agentName: string;
  entries: MemoryEntry[];
  onEntryClick?: (entry: MemoryEntry) => void;
}

const getStatusColor = (entry: MemoryEntry): 'success' | 'error' | 'info' | 'warning' => {
  if (entry.metadata.error) return 'error';
  if (entry.metadata.type === 'action') return 'warning';
  if (entry.metadata.type === 'insight') return 'info';
  return 'success';
};

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

const truncateValue = (value: any): string => {
  const str = JSON.stringify(value);
  return str.length > 100 ? str.substring(0, 97) + '...' : str;
};

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  agentName,
  entries,
  onEntryClick,
}) => {
  if (entries.length === 0) {
    return (
      <Typography color="textSecondary" align="center">
        No memory entries found
      </Typography>
    );
  }

  return (
    <Timeline>
      {entries.map((entry, index) => (
        <TimelineItem key={`${entry.key}-${entry.metadata.timestamp}`}>
          <TimelineSeparator>
            <TimelineDot color={getStatusColor(entry)} />
            {index < entries.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                cursor: onEntryClick ? 'pointer' : 'default',
                '&:hover': onEntryClick ? { boxShadow: 2 } : {},
              }}
              onClick={() => onEntryClick?.(entry)}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {formatDateTime(entry.metadata.timestamp)}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                {entry.key}
              </Typography>
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                  {truncateValue(entry.value)}
                </Typography>
              </Box>
              {entry.metadata.type && (
                <Typography variant="caption" color="textSecondary">
                  Type: {entry.metadata.type}
                </Typography>
              )}
              {entry.metadata.error && (
                <Typography variant="caption" color="error">
                  Error: {entry.metadata.error}
                </Typography>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
