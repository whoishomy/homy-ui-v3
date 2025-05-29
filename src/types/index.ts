// Agent Types
export interface AgentContext {
  name: string;
  timestamp: string;
  memoryKeys: string[];
  metadata?: Record<string, any>;
}

export interface AgentOutput {
  success: boolean;
  data?: any;
  error?: string;
  actions?: Array<{
    type: string;
    payload: any;
  }>;
}

// Memory Types
export interface MemoryEntry {
  key: string;
  value: any;
  metadata: {
    timestamp: string;
    agent: string;
    [key: string]: any;
  };
}

export interface MemoryQueryOptions {
  limit?: number;
  startTime?: string;
  endTime?: string;
  filter?: (entry: MemoryEntry) => boolean;
}

// Prompt Types
export interface PromptConfig {
  name: string;
  description: string;
  version: string;
  input: any;
  output: any;
  prompts: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  examples?: Array<{
    input: any;
    output: any;
  }>;
}

export interface PromptResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Agent Runner Types
export interface AgentRunnerConfig {
  name: string;
  schedule?: string;
  triggers?: string[];
  enabled: boolean;
  metadata?: Record<string, any>;
}

export interface AgentRunnerStatus {
  name: string;
  status: 'idle' | 'running' | 'error';
  lastRun?: string;
  nextRun?: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Event Types
export interface AgentEvent {
  name: string;
  type: string;
  timestamp: string;
  data?: any;
  error?: string;
}

// UI Types
export interface AgentCardProps {
  name: string;
  status: AgentRunnerStatus;
  onEnable: () => void;
  onDisable: () => void;
  onRun: () => void;
}

export interface MemoryTimelineProps {
  agentName: string;
  entries: MemoryEntry[];
  onEntryClick?: (entry: MemoryEntry) => void;
}

export interface AgentDashboardProps {
  agents: AgentRunnerStatus[];
  onAgentAction: (name: string, action: string) => void;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export * from './practice-agent';
