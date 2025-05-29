import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { AgentCard } from './AgentCard';
import { PromptFeed } from './PromptFeed';
import { MemoryLogTimeline } from './MemoryLogTimeline';

// Mock data for demonstration
const mockAgents = [
  {
    name: 'InsightEngine',
    status: 'active' as const,
    memoryCount: 4,
    model: 'Claude 3.5',
    lastExecuted: 'lab-insight-analyzer',
    icon: 'insight' as const,
  },
  {
    name: 'LabAnalyzer',
    status: 'idle' as const,
    memoryCount: 1,
    model: 'GPT-4',
    lastExecuted: 'triage-rule-generator',
    icon: 'lab' as const,
  },
  {
    name: 'TriageAgent',
    status: 'waiting' as const,
    memoryCount: 3,
    model: 'Claude 3.5',
    lastExecuted: 'alert-severity-check',
    icon: 'triage' as const,
  },
  {
    name: 'DashboardAgent',
    status: 'active' as const,
    memoryCount: 7,
    model: 'Claude 3.5',
    lastExecuted: 'render-lab-results',
    icon: 'dashboard' as const,
  },
];

const mockPromptLogs = [
  {
    time: '08:13',
    command: 'apply promptpack lab-insight-analyzer',
    status: 'success' as const,
  },
  {
    time: '08:14',
    command: 'triage-rule-generator',
    status: 'success' as const,
  },
  {
    time: '08:16',
    command: 'dashboard-agent auto-rendered LabResultsCard',
    status: 'success' as const,
  },
  {
    time: '08:18',
    command: 'gpt4-insight-layer',
    status: 'in-progress' as const,
    details: 'Simplifying alert description...',
  },
];

const mockMemoryEntries = [
  {
    component: 'Lab: CBC / WBC ↓',
    source: 'GPT-4',
    insight: 'Risk: Medium',
    action: 'Re-test in 6h',
    severity: 'medium' as const,
    timestamp: '2024-03-26 08:13:45',
  },
  {
    component: 'Insight Generation',
    source: 'Claude',
    insight: 'Rendered in Dashboard v1.3',
    timestamp: '2024-03-26 08:14:22',
  },
  {
    component: 'Action Required',
    source: 'Claude',
    insight: 'AlertBadge: Orange',
    action: 'Notify attending physician',
    severity: 'medium' as const,
    timestamp: '2024-03-26 08:16:01',
  },
];

export const AgentPanel: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          overflow: 'hidden',
          p: 3,
        }}
      >
        {/* Agent Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          {mockAgents.map((agent) => (
            <AgentCard key={agent.name} {...agent} />
          ))}
        </Box>

        {/* Prompt Feed and Memory Timeline */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
            gap: 3,
          }}
        >
          <PromptFeed logs={mockPromptLogs} />
          <MemoryLogTimeline entries={mockMemoryEntries} />
        </Box>
      </Box>
    </Container>
  );
};
