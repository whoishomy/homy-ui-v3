import { AgentConversationState } from '@/types/agent';

export const mockConversation: AgentConversationState = {
  mode: {
    isActive: true,
    currentTopic: 'Lab Results Analysis',
    startedAt: new Date().toISOString(),
    context: {
      userIntent: 'Analyze lab results for anomalies',
      systemState: 'processing',
      previousActions: ['Loaded lab data', 'Started analysis'],
    },
  },
  history: [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      message: 'Can you help me analyze these lab results?',
      type: 'user',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      message:
        "Of course! I'll help you analyze the lab results. What specific aspects would you like me to focus on?",
      type: 'agent',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 3000).toISOString(),
      message: 'Look for any abnormal values and trends over time.',
      type: 'user',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 2000).toISOString(),
      message:
        "I'll analyze the values and compare them with reference ranges. I'll also check for any significant changes in trends.",
      type: 'agent',
      metadata: {
        action: 'analyze',
        parameters: {
          type: 'lab_results',
          focus: ['abnormal_values', 'trends'],
        },
      },
    },
  ],
};
