import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Agent,
  AgentStatusType,
  AgentTask,
  ConversationMode,
  AgentConversationState,
} from '../types/agent';
import { mockAgents, mockTasks } from '../mock/agents';
import { mockConversation } from '../mock/conversation';
import { randomUUID } from 'crypto';

interface AgentState {
  agents: Agent[];
  selectedAgentId: string | null;
  tasks: Record<string, AgentTask[]>;
  isInitialized: boolean;
  conversation: AgentConversationState;
}

interface AgentActions {
  // Agent Management
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  setSelectedAgent: (id: string | null) => void;

  // Task Management
  addTask: (agentId: string, task: AgentTask) => void;
  updateTask: (agentId: string, taskId: string, updates: Partial<AgentTask>) => void;
  removeTask: (agentId: string, taskId: string) => void;

  // Status Management
  updateAgentStatus: (id: string, status: AgentStatusType, message?: string) => void;

  // Batch Operations
  batchUpdateAgents: (updates: Array<{ id: string; updates: Partial<Agent> }>) => void;
  resetStore: () => void;

  // Conversation Mode Actions
  startConversation: (topic?: string) => void;
  endConversation: () => void;
  addConversationMessage: (
    message: string,
    type: 'user' | 'agent',
    metadata?: Record<string, any>
  ) => void;
  updateConversationContext: (context: Partial<ConversationMode['context']>) => void;
}

const initialState: AgentState = {
  agents: mockAgents,
  selectedAgentId: null,
  tasks: mockTasks,
  isInitialized: false,
  conversation: mockConversation,
};

export const useAgentStore = create<AgentState & AgentActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...initialState,

        // Agent Management
        setAgents: (agents) => set({ agents, isInitialized: true }),

        updateAgent: (id, updates) =>
          set((state) => ({
            agents: state.agents.map((agent) =>
              agent.id === id ? { ...agent, ...updates } : agent
            ),
          })),

        setSelectedAgent: (id) => set({ selectedAgentId: id }),

        // Task Management
        addTask: (agentId, task) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              [agentId]: [...(state.tasks[agentId] || []), task],
            },
          })),

        updateTask: (agentId, taskId, updates) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              [agentId]:
                state.tasks[agentId]?.map((task) =>
                  task.id === taskId ? { ...task, ...updates } : task
                ) || [],
            },
          })),

        removeTask: (agentId, taskId) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              [agentId]: state.tasks[agentId]?.filter((task) => task.id !== taskId) || [],
            },
          })),

        // Status Management
        updateAgentStatus: (id, status, message) =>
          set((state) => ({
            agents: state.agents.map((agent) =>
              agent.id === id
                ? {
                    ...agent,
                    status: {
                      ...agent.status,
                      type: status,
                      message: message || `Agent is ${status}`,
                      since: new Date().toISOString(),
                    },
                  }
                : agent
            ),
          })),

        // Batch Operations
        batchUpdateAgents: (updates) =>
          set((state) => ({
            agents: state.agents.map((agent) => {
              const update = updates.find((u) => u.id === agent.id);
              return update ? { ...agent, ...update.updates } : agent;
            }),
          })),

        resetStore: () => set(initialState),

        // Conversation Mode Actions
        startConversation: (topic?: string) =>
          set((state) => ({
            conversation: {
              ...state.conversation,
              mode: {
                isActive: true,
                currentTopic: topic,
                startedAt: new Date().toISOString(),
                context: {
                  userIntent: '',
                  systemState: 'initialized',
                  previousActions: [],
                },
              },
            },
          })),

        endConversation: () =>
          set((state) => ({
            conversation: {
              ...state.conversation,
              mode: {
                isActive: false,
              },
            },
          })),

        addConversationMessage: (message, type, metadata) =>
          set((state) => ({
            conversation: {
              ...state.conversation,
              history: [
                ...state.conversation.history,
                {
                  id: randomUUID(),
                  timestamp: new Date().toISOString(),
                  message,
                  type,
                  metadata,
                },
              ],
            },
          })),

        updateConversationContext: (context) =>
          set((state) => ({
            conversation: {
              ...state.conversation,
              mode: {
                ...state.conversation.mode,
                context: {
                  ...state.conversation.mode.context,
                  ...context,
                },
              },
            },
          })),
      }),
      {
        name: 'agent-store',
        partialize: (state) => ({
          agents: state.agents,
          selectedAgentId: state.selectedAgentId,
          tasks: state.tasks,
          conversation: state.conversation,
        }),
      }
    )
  )
);
