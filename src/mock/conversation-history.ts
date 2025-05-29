import { ConversationSummary } from '@/types/conversation';

export const mockConversationHistory: ConversationSummary[] = [
  {
    id: '1',
    topic: 'Lab Results Analysis',
    status: 'active',
    agentId: 'lab-analyzer',
    agentName: 'Lab Analyzer',
    startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    messageCount: 12,
    lastMessageAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    metrics: {
      responseTime: 1.2,
      completionRate: 0.85,
      userSatisfaction: 0.9,
    },
    tags: ['lab-results', 'analysis', 'urgent'],
  },
  {
    id: '2',
    topic: 'Vital Signs Monitoring',
    status: 'completed',
    agentId: 'vital-monitor',
    agentName: 'Vital Monitor',
    startedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    endedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    messageCount: 8,
    lastMessageAt: new Date(Date.now() - 5400000).toISOString(),
    metrics: {
      responseTime: 0.8,
      completionRate: 1.0,
      userSatisfaction: 0.95,
    },
    tags: ['vitals', 'monitoring', 'completed'],
  },
  {
    id: '3',
    topic: 'Medication Schedule Review',
    status: 'flagged',
    agentId: 'med-assistant',
    agentName: 'Medication Assistant',
    startedAt: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    messageCount: 15,
    lastMessageAt: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    metrics: {
      responseTime: 2.1,
      completionRate: 0.75,
      userSatisfaction: 0.6,
    },
    tags: ['medication', 'review', 'needs-attention'],
  },
  {
    id: '4',
    topic: 'Diet Plan Analysis',
    status: 'archived',
    agentId: 'nutrition-advisor',
    agentName: 'Nutrition Advisor',
    startedAt: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
    endedAt: new Date(Date.now() - 169200000).toISOString(), // 47 hours ago
    messageCount: 20,
    lastMessageAt: new Date(Date.now() - 169200000).toISOString(),
    metrics: {
      responseTime: 1.5,
      completionRate: 0.95,
      userSatisfaction: 0.85,
    },
    tags: ['nutrition', 'diet', 'completed', 'archived'],
  },
];
