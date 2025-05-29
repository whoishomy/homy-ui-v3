'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { CursorBadge } from '@/components/ui/cursor-badge';
import { Play, Pause, RefreshCw, MoreVertical, Clock, AlertTriangle } from 'lucide-react';
import type { AgentStatusCardProps } from '@/types/agent';
import { TaskQueuePanel } from './TaskQueuePanel';
import { Agent } from '@/types/agent';

interface Props {
  agent: Agent;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onAction: (action: 'start' | 'stop' | 'restart', id: string) => void;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: Clock,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    label: 'Idle',
  },
  running: {
    icon: Play,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-800',
    borderColor: 'border-green-200 dark:border-green-700',
    label: 'Running',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-800',
    borderColor: 'border-red-200 dark:border-red-700',
    label: 'Error',
  },
  paused: {
    icon: Pause,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-800',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    label: 'Paused',
  },
};

export const AgentStatusCard = ({
  agent,
  isSelected = false,
  onSelect,
  onAction,
  className,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = statusConfig[agent.status.type];
  const StatusIcon = config.icon;

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAction = (action: 'start' | 'stop' | 'restart') => {
    onAction?.(action, agent.id);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(isSelected ? null : agent.id);
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all',
        isSelected && 'ring-2 ring-green-500 dark:ring-green-400',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={handleSelect}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span
              className={cn('flex-shrink-0 w-3 h-3 rounded-full animate-pulse', config.color)}
            />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</h3>
          </div>

          <div className="flex items-center space-x-2">
            {agent.status.type === 'running' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('stop');
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                         text-gray-400 hover:text-gray-500 dark:text-gray-500 
                         dark:hover:text-gray-400 transition-colors"
                aria-label="Stop agent"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('start');
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                         text-gray-400 hover:text-gray-500 dark:text-gray-500 
                         dark:hover:text-gray-400 transition-colors"
                aria-label="Start agent"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('restart');
              }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                       text-gray-400 hover:text-gray-500 dark:text-gray-500 
                       dark:hover:text-gray-400 transition-colors"
              aria-label="Restart agent"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className={cn('text-sm', config.color)}>{agent.status.message}</p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(agent.status.since).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.entries(agent.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase">{key}</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* Task Queue Panel */}
      {isSelected && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <TaskQueuePanel agentId={agent.id} />
        </div>
      )}
    </div>
  );
};
