'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  MessageSquare,
  Archive,
  Flag,
  Download,
  Trash2,
  ChevronDown,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  ConversationSummary,
  ConversationFilter,
  ConversationSort,
  ConversationStatus,
} from '@/types/conversation';

interface ConversationHistoryProps {
  conversations: ConversationSummary[];
  onAction: (type: 'archive' | 'flag' | 'export' | 'delete', id: string) => void;
  onSelect: (id: string) => void;
  className?: string;
}

export const ConversationHistory = ({
  conversations,
  onAction,
  onSelect,
  className,
}: ConversationHistoryProps) => {
  const [filter, setFilter] = useState<ConversationFilter>({});
  const [sort, setSort] = useState<ConversationSort>({
    field: 'lastMessageAt',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    }
  };

  const getStatusIcon = (status: ConversationStatus) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      case 'flagged':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg shadow', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Konuşma Geçmişi
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter({})}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Konu veya agent ismi ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-sm focus:outline-none focus:ring-2 focus:ring-green-500 
                       dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={() => {
              /* TODO: Implement filter dialog */
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
          <button
            onClick={() => {
              setSort((prev) => ({
                ...prev,
                direction: prev.direction === 'asc' ? 'desc' : 'asc',
              }));
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                sort.direction === 'asc' && 'rotate-180'
              )}
            />
            Sırala
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => onSelect(conversation.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.topic}
                  </h3>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                      getStatusColor(conversation.status)
                    )}
                  >
                    {getStatusIcon(conversation.status)}
                    {conversation.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {conversation.agentName} • {conversation.messageCount} mesaj •{' '}
                  {format(new Date(conversation.lastMessageAt), 'dd MMMM yyyy HH:mm', {
                    locale: tr,
                  })}
                </p>
                {conversation.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {conversation.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 
                                 text-xs text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('archive', conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('flag', conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('export', conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('delete', conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Yanıt Süresi</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {conversation.metrics.responseTime.toFixed(1)}s
                </p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tamamlanma</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  %{(conversation.metrics.completionRate * 100).toFixed(0)}
                </p>
              </div>
              {conversation.metrics.userSatisfaction && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Memnuniyet</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    %{(conversation.metrics.userSatisfaction * 100).toFixed(0)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
