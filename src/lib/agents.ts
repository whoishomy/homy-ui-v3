import { type Agent } from '@/components/agent-dashboard/AgentCard';
import { type LogEntry } from '@/components/agent-dashboard/LogStream';

export const dummyAgents: Agent[] = [
  {
    id: 'insight-engine',
    name: 'InsightEngine',
    type: 'Analysis',
    description: 'Generates insights from health data and user interactions',
    status: {
      type: 'online',
      message: 'Processing insights',
      lastPing: new Date().toISOString(),
    },
    icon: '🧠',
    metrics: {
      activeJobs: 3,
      queueSize: 5,
      successRate: 98,
    },
  },
  {
    id: 'notifier',
    name: 'Notifier',
    type: 'Communication',
    description: 'Handles system notifications and reminders',
    status: {
      type: 'online',
      message: 'Sending notifications',
      lastPing: new Date().toISOString(),
    },
    icon: '📢',
    metrics: {
      activeJobs: 1,
      queueSize: 2,
      successRate: 100,
    },
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    type: 'Planning',
    description: 'Manages calendar events and task scheduling',
    status: {
      type: 'pending',
      message: 'Waiting for next task',
      lastPing: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    },
    icon: '⏰',
    metrics: {
      activeJobs: 0,
      queueSize: 1,
      successRate: 95,
    },
  },
  {
    id: 'task-manager',
    name: 'TaskManager',
    type: 'Workflow',
    description: 'Coordinates task execution and monitors progress',
    status: {
      type: 'error',
      message: 'Database connection failed',
      lastPing: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    },
    icon: '📋',
    metrics: {
      activeJobs: 5,
      queueSize: 8,
      successRate: 75,
    },
  },
  {
    id: 'summarizer',
    name: 'Summarizer',
    type: 'Content',
    description: 'Creates concise summaries of medical reports and feedback',
    status: {
      type: 'online',
      message: 'Processing reports',
      lastPing: new Date().toISOString(),
    },
    icon: '📝',
    metrics: {
      activeJobs: 2,
      queueSize: 3,
      successRate: 92,
    },
  },
];

export const dummyLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    agentId: 'claude',
    level: 'info',
    message: 'Processing user query',
    details: 'Query: "What are the latest lab results?"',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    agentId: 'notifier',
    level: 'warning',
    message: 'Message delivery delayed',
    details: 'Retry attempt 1 of 3',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10000).toISOString(),
    agentId: 'analyst',
    level: 'error',
    message: 'Failed to process data',
    details: 'Error: Invalid data format',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    agentId: 'monitor',
    level: 'debug',
    message: 'System metrics collected',
    details: 'CPU: 45%, Memory: 60%, Network: OK',
  },
];

export const useAgentData = () => {
  return {
    agents: dummyAgents,
    logs: dummyLogs,
  };
};
