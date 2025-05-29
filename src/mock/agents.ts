import { Agent, AgentTask } from '@/types/agent';

export const mockAgents: Agent[] = [
  {
    id: 'lab-analyzer',
    name: 'Lab Analyzer',
    type: 'analyze',
    description: 'Analyzes lab results for anomalies and trends',
    status: {
      type: 'running',
      message: 'Processing lab results',
      since: new Date().toISOString(),
    },
    metrics: {
      activeJobs: 2,
      queueSize: 5,
      successRate: 0.98,
    },
    capabilities: {
      canProcess: ['analyze', 'process'],
      maxConcurrentTasks: 5,
      supportedModels: ['gpt-4', 'gpt-3.5-turbo'],
    },
    cursorState: 'think',
    lastRunAt: new Date(Date.now() - 300000).toISOString(),
    nextRunAt: new Date(Date.now() + 300000).toISOString(),
    config: {
      autoRestart: true,
      maxRetries: 3,
      timeout: 30000,
    },
    icon: 'lab',
  },
  {
    id: 'vital-monitor',
    name: 'Vital Monitor',
    type: 'monitor',
    description: 'Monitors vital signs and alerts on abnormalities',
    status: {
      type: 'idle',
      message: 'Waiting for new data',
      since: new Date().toISOString(),
    },
    metrics: {
      activeJobs: 0,
      queueSize: 0,
      successRate: 1.0,
    },
    capabilities: {
      canProcess: ['process', 'notify'],
      maxConcurrentTasks: 3,
      supportedModels: ['gpt-4'],
    },
    cursorState: 'do',
    lastRunAt: new Date(Date.now() - 600000).toISOString(),
    config: {
      autoRestart: true,
      maxRetries: 5,
      timeout: 60000,
    },
    icon: 'monitor',
  },
];

export const mockTasks: Record<string, AgentTask[]> = {
  'lab-analyzer': [
    {
      id: '1',
      type: 'analyze',
      description: 'Analyze blood test results',
      status: 'running',
      startedAt: new Date(Date.now() - 120000).toISOString(),
      priority: 'high',
    },
    {
      id: '2',
      type: 'process',
      description: 'Process imaging results',
      status: 'pending',
      priority: 'medium',
    },
  ],
  'vital-monitor': [
    {
      id: '3',
      type: 'notify',
      description: 'Alert on abnormal heart rate',
      status: 'completed',
      startedAt: new Date(Date.now() - 300000).toISOString(),
      completedAt: new Date(Date.now() - 290000).toISOString(),
      priority: 'high',
    },
  ],
};
