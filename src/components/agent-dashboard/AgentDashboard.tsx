'use client';

import { useState } from 'react';
import { useAgentStore } from '@/stores/agentStore';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { AgentCard } from './AgentCard';
import { ConversationPanel } from './ConversationPanel';
import { ConversationHistory } from './ConversationHistory';

export const AgentDashboard = () => {
  const { agents, selectedAgentId, setSelectedAgent } = useAgentStore();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const {
    conversations,
    filter,
    setFilter,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    handleAction,
  } = useConversationHistory();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar - Agent Cards */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agents</h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={agent.id === selectedAgentId}
              onClick={() => setSelectedAgent(agent.id)}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Conversation History */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ConversationHistory
            conversations={conversations}
            onAction={handleAction}
            onSelect={setSelectedConversationId}
          />
        </div>

        {/* Right Sidebar - Active Conversation */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {selectedConversationId ? (
            <ConversationPanel
              conversation={conversations.find((c) => c.id === selectedConversationId)}
              onCloseAction={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
