'use client';

import { Brain, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Agent, AgentStatusType } from '@/types/agent';
import { AgentLiveBadge } from './AgentLiveBadge';

export type { Agent };

interface AgentCardProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

export const AgentCard = ({ agent, isSelected, onClick, className }: AgentCardProps) => {
  const getStatusColor = (status: AgentStatusType) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'idle':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusText = (status: AgentStatusType) => {
    switch (status) {
      case 'running':
        return 'Active';
      case 'idle':
        return 'Idle';
      case 'error':
        return 'Error';
      default:
        return status;
    }
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all cursor-pointer',
        isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-200 dark:hover:border-green-700',
        className
      )}
      onClick={() => onClick?.(agent.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{agent.description}</p>
          </div>
        </div>
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
            getStatusColor(agent.status.type)
          )}
        >
          <Activity className="w-3 h-3" />
          {getStatusText(agent.status.type)}
        </span>
      </div>

      {agent.status.message && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{agent.status.message}</p>
      )}

      <AgentLiveBadge
        startTime={agent.status.lastActiveAt}
        isActive={agent.status.type === 'running'}
        className="mt-3"
      />
    </div>
  );
};
