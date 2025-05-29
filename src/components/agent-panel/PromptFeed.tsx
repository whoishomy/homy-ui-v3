import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Terminal, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PromptLog {
  time: string;
  command: string;
  status: 'success' | 'error' | 'in-progress';
  details?: string;
}

interface PromptFeedProps {
  logs: PromptLog[];
}

const getStatusIcon = (status: PromptLog['status']) => {
  const icons = {
    success: <CheckCircle size={16} color="#4CAF50" />,
    error: <AlertCircle size={16} color="#F44336" />,
    'in-progress': <Clock size={16} color="#2196F3" />,
  };
  return icons[status];
};

const getStatusColor = (status: PromptLog['status']) => {
  const colors = {
    success: '#E8F5E9',
    error: '#FFEBEE',
    'in-progress': '#E3F2FD',
  };
  return colors[status];
};

export const PromptFeed: React.FC<PromptFeedProps> = ({ logs }) => {
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
        <Terminal size={20} />
        <Typography variant="h6">Live Prompt Feed</Typography>
      </Box>

      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {logs.map((log, index) => (
          <ListItem
            key={`${log.time}-${index}`}
            sx={{
              backgroundColor: getStatusColor(log.status),
              borderRadius: 1,
              mb: 1,
              '&:last-child': { mb: 0 },
            }}
          >
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                  >
                    {log.time}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}
                  >
                    {log.command}
                  </Typography>
                  <Chip
                    size="small"
                    icon={getStatusIcon(log.status)}
                    label={log.status}
                    sx={{
                      ml: 'auto',
                      backgroundColor: 'transparent',
                      '& .MuiChip-label': { px: 0 },
                    }}
                  />
                </Box>
              }
              secondary={
                log.details && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontFamily: 'monospace' }}
                  >
                    {log.details}
                  </Typography>
                )
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
