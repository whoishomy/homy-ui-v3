import { type CursorBadgeVariant } from '@/components/ui/cursor-badge';

export interface AgentContext {
  name: string;
  timestamp: string;
  memoryKeys?: string[];
  data?: any;
}

export interface AgentOutput {
  success: boolean;
  data?: {
    vitals?: any;
    insights?: Array<{
      type: string;
      description: string;
      severity: number;
      suggestedActions?: string[];
    }>;
    actions?: any[];
  };
  error?: string;
}

export interface AgentRunnerConfig {
  schedule?: string;
  enabled?: boolean;
  data?: any;
}

export interface AgentRunner {
  runAgent(name: string, config?: AgentRunnerConfig): Promise<AgentOutput>;
  registerAgent(name: string, config: AgentRunnerConfig): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

export type AgentStatusType = 'idle' | 'running' | 'paused' | 'error';

export type AgentTaskType = 'process' | 'analyze' | 'notify' | 'sync' | 'custom';

export type AgentTaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export type AgentTaskPriority = 'low' | 'medium' | 'high';

export interface AgentTask {
  id: string;
  type: AgentTaskType;
  description: string;
  status: AgentTaskStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  priority?: AgentTaskPriority;
}

export interface AgentMetrics {
  [key: string]: string | number;
}

export interface AgentStatus {
  type: AgentStatusType;
  message: string;
  since: string;
  lastActiveAt: string;
}

export interface AgentCapabilities {
  canProcess: AgentTaskType[];
  maxConcurrentTasks: number;
  supportedModels: string[];
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  status: AgentStatus;
  icon?: string;
  metrics: {
    activeJobs?: number;
    queueSize?: number;
    successRate?: number;
  };
  capabilities: AgentCapabilities;
  cursorState: CursorBadgeVariant;
  lastRunAt?: string;
  nextRunAt?: string;
  config: {
    autoRestart: boolean;
    maxRetries: number;
    timeout: number; // in milliseconds
  };
}

export interface AgentStatusCardProps {
  agent: Agent;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onAction?: (action: 'start' | 'stop' | 'restart', id: string) => void;
  className?: string;
}

export interface ConversationMode {
  isActive: boolean;
  currentTopic?: string;
  startedAt?: string;
  context?: {
    userIntent?: string;
    systemState?: string;
    previousActions?: string[];
  };
}

export interface AgentConversationState {
  mode: ConversationMode;
  history: {
    id: string;
    timestamp: string;
    message: string;
    type: 'user' | 'agent';
    metadata?: Record<string, any>;
  }[];
}

export type SystemStatus = 'all_green' | 'degraded' | 'pending_input' | 'fallback_active';
