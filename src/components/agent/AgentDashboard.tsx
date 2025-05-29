import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { AgentCard } from './AgentCard';
import { MemoryTimeline } from './MemoryTimeline';
import { agentRunner } from '../../agent-runner';
import type { AgentRunnerStatus, MemoryEntry } from '../../types';
import { fetchMemoryData } from '../../memory';

export const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentRunnerStatus[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    // Initial load
    setAgents(agentRunner.getAllAgentStatus());

    // Subscribe to status updates
    const handleStatusUpdate = (status: AgentRunnerStatus) => {
      setAgents((current) => current.map((agent) => (agent.name === status.name ? status : agent)));
    };

    agentRunner.on('statusUpdate', handleStatusUpdate);
    return () => {
      agentRunner.off('statusUpdate', handleStatusUpdate);
    };
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadMemoryEntries(selectedAgent);
    }
  }, [selectedAgent]);

  const loadMemoryEntries = async (agentName: string) => {
    try {
      const data = await fetchMemoryData([`${agentName}-latest`, `${agentName}-history`]);
      const entries = [
        ...(data[`${agentName}-latest`] || []),
        ...(data[`${agentName}-history`] || []),
      ].sort(
        (a, b) =>
          new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
      );
      setMemoryEntries(entries);
    } catch (error) {
      console.error('Failed to load memory entries:', error);
    }
  };

  const handleAgentAction = async (name: string, action: string) => {
    try {
      switch (action) {
        case 'enable':
          await agentRunner.enableAgent(name);
          break;
        case 'disable':
          await agentRunner.disableAgent(name);
          break;
        case 'run':
          await agentRunner.runAgent(name);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} agent ${name}:`, error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agent Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Agent Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} key={agent.name}>
                <AgentCard
                  name={agent.name}
                  status={agent}
                  onEnable={() => handleAgentAction(agent.name, 'enable')}
                  onDisable={() => handleAgentAction(agent.name, 'disable')}
                  onRun={() => handleAgentAction(agent.name, 'run')}
                  onClick={() => setSelectedAgent(agent.name)}
                  selected={selectedAgent === agent.name}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Memory Timeline */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Memory Timeline
            </Typography>
            {selectedAgent ? (
              <MemoryTimeline
                agentName={selectedAgent}
                entries={memoryEntries}
                onEntryClick={(entry: MemoryEntry) => {
                  console.log('Memory entry clicked:', entry);
                }}
              />
            ) : (
              <Typography color="textSecondary">
                Select an agent to view its memory timeline
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
