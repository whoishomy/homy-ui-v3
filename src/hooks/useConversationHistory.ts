import { useState, useMemo } from 'react';
import { useAgentStore } from '@/stores/agentStore';
import {
  ConversationSummary,
  ConversationFilter,
  ConversationSort,
  ConversationAction,
  ConversationExport,
} from '@/types/conversation';
import { mockConversationHistory } from '@/mock/conversation-history';

export const useConversationHistory = () => {
  const [filter, setFilter] = useState<ConversationFilter>({});
  const [sort, setSort] = useState<ConversationSort>({
    field: 'lastMessageAt',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // In a real implementation, this would come from the store
  const conversations = mockConversationHistory;

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            conv.topic.toLowerCase().includes(searchLower) ||
            conv.agentName.toLowerCase().includes(searchLower)
          );
        }
        if (filter.status?.length) {
          return filter.status.includes(conv.status);
        }
        if (filter.agentId) {
          return conv.agentId === filter.agentId;
        }
        if (filter.tags?.length) {
          return filter.tags.some((tag) => conv.tags.includes(tag));
        }
        if (filter.dateRange) {
          const start = new Date(filter.dateRange.start).getTime();
          const end = new Date(filter.dateRange.end).getTime();
          const convDate = new Date(conv.startedAt).getTime();
          return convDate >= start && convDate <= end;
        }
        return true;
      })
      .sort((a, b) => {
        const field = sort.field;
        const direction = sort.direction === 'asc' ? 1 : -1;

        if (field === 'metrics.responseTime') {
          return (a.metrics.responseTime - b.metrics.responseTime) * direction;
        }

        if (field === 'metrics.completionRate') {
          return (a.metrics.completionRate - b.metrics.completionRate) * direction;
        }

        if (field === 'lastMessageAt' || field === 'startedAt') {
          return (new Date(a[field]).getTime() - new Date(b[field]).getTime()) * direction;
        }

        const aValue = a[field as keyof Omit<ConversationSummary, 'metrics'>];
        const bValue = b[field as keyof Omit<ConversationSummary, 'metrics'>];

        return String(aValue).localeCompare(String(bValue)) * direction;
      });
  }, [conversations, filter, sort, searchTerm]);

  const handleAction = async (type: ConversationAction['type'], id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation) return;

    switch (type) {
      case 'archive':
        console.log('Archiving conversation:', id);
        // TODO: Implement archive action
        break;

      case 'flag':
        console.log('Flagging conversation:', id);
        // TODO: Implement flag action
        break;

      case 'export':
        console.log('Exporting conversation:', id);
        const exportConfig: ConversationExport = {
          format: 'json',
          includeMetrics: true,
          includeSystemMessages: false,
        };
        // TODO: Implement export action
        break;

      case 'delete':
        console.log('Deleting conversation:', id);
        // TODO: Implement delete action
        break;
    }
  };

  return {
    conversations: filteredConversations,
    filter,
    setFilter,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    handleAction,
  };
};
