import { AgentStatus } from './agent';

export type ConversationStatus = 'active' | 'completed' | 'archived' | 'flagged';

export interface ConversationSummary {
  id: string;
  topic: string;
  status: ConversationStatus;
  agentId: string;
  agentName: string;
  startedAt: string;
  endedAt?: string;
  messageCount: number;
  lastMessageAt: string;
  metrics: {
    responseTime: number;
    userSatisfaction?: number;
    completionRate: number;
  };
  tags: string[];
}

export interface ConversationFilter {
  status?: ConversationStatus[];
  agentId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  tags?: string[];
}

export interface ConversationSort {
  field: keyof ConversationSummary | 'metrics.responseTime' | 'metrics.completionRate';
  direction: 'asc' | 'desc';
}

export interface ConversationExport {
  format: 'json' | 'markdown';
  includeMetrics: boolean;
  includeSystemMessages: boolean;
}

export interface ConversationAction {
  type: 'archive' | 'flag' | 'export' | 'delete';
  conversationId: string;
  metadata?: Record<string, unknown>;
}

// Health monitoring types
export interface ConversationHealth {
  overallScore: number; // 0-100
  metrics: {
    avgResponseTime: number;
    completionRate: number;
    userSatisfaction: number;
    errorRate: number;
    activeConversations: number;
  };
  trends: {
    daily: HealthTrend[];
    weekly: HealthTrend[];
    monthly: HealthTrend[];
  };
  alerts: HealthAlert[];
}

export interface HealthTrend {
  timestamp: string;
  value: number;
  change: number; // percentage change from previous period
}

export interface HealthAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  metric: keyof ConversationHealth['metrics'];
  threshold: number;
  currentValue: number;
  timestamp: string;
}
