'use client';

import { useEffect } from 'react';
import { AgentStatusCard } from '@/components/agent-dashboard/AgentStatusCard';
import { useAgentStore } from '@/stores/agentStore';
import { eventManager, AgentEvent } from '@/lib/events';
import { Agent, AgentTask } from '@/types/agent';

export default function AgentDashboardPage() {
  const {
    agents,
    selectedAgentId,
    setSelectedAgent,
    updateAgentStatus,
    updateTask,
    addTask,
    removeTask,
  } = useAgentStore();

  useEffect(() => {
    // Connect to SSE when component mounts
    eventManager.connect();

    // Subscribe to events
    eventManager.subscribe('agent_update', (event) => {
      const { agentId, data } = event;
      const agentData = data as Partial<Agent>;
      if (agentData.status?.type && agentData.status?.message) {
        updateAgentStatus(agentId, agentData.status.type, agentData.status.message);
      }
    });

    eventManager.subscribe('task_update', (event) => {
      const { agentId, data } = event;
      const taskData = data as AgentTask;
      if (taskData.id) {
        updateTask(agentId, taskData.id, taskData);
      }
    });

    eventManager.subscribe('task_created', (event) => {
      const { agentId, data } = event;
      const taskData = data as AgentTask;
      if (taskData.id) {
        addTask(agentId, taskData);
      }
    });

    eventManager.subscribe('task_deleted', (event) => {
      const { agentId, data } = event;
      const taskData = data as AgentTask;
      if (taskData.id) {
        removeTask(agentId, taskData.id);
      }
    });

    // Cleanup on unmount
    return () => {
      eventManager.disconnect();
    };
  }, [updateAgentStatus, updateTask, addTask, removeTask]);

  const handleAgentAction = (action: 'start' | 'stop' | 'restart', id: string) => {
    switch (action) {
      case 'start':
        updateAgentStatus(id, 'running', 'Agent started successfully');
        break;
      case 'stop':
        updateAgentStatus(id, 'paused', 'Agent stopped by user');
        break;
      case 'restart':
        updateAgentStatus(id, 'idle', 'Agent is restarting...');
        // Simulate restart process
        setTimeout(() => {
          updateAgentStatus(id, 'running', 'Agent restarted successfully');
        }, 1500);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Agent Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <AgentStatusCard
              key={agent.id}
              agent={agent}
              isSelected={agent.id === selectedAgentId}
              onSelect={setSelectedAgent}
              onAction={handleAgentAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
