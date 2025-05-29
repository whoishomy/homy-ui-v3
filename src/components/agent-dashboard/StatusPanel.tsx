'use client';

import { cn } from '@/utils/cn';
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { type Agent } from './AgentCard';

export type SystemStatus = 'all_green' | 'degraded' | 'pending_input' | 'fallback_active';

interface StatusPanelProps {
  status: SystemStatus;
  message: string;
  agents?: Agent[];
  className?: string;
}

const statusConfig = {
  all_green: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-900/30',
    label: 'All Systems Operational',
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-900/30',
    label: 'Degraded Performance',
  },
  pending_input: {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-900/30',
    label: 'Pending Input',
  },
  fallback_active: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-900/30',
    label: 'Fallback Active',
  },
};

export const StatusPanel = ({ status, message, agents = [], className }: StatusPanelProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  // Calculate agent statistics
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status.type === 'online').length;
  const errorAgents = agents.filter((a) => a.status.type === 'error').length;
  const pendingAgents = agents.filter((a) => a.status.type === 'pending').length;

  // Calculate overall system health percentage
  const systemHealth = Math.round((activeAgents / totalAgents) * 100);

  return (
    <div className={cn('rounded-lg border p-4', config.bgColor, config.borderColor, className)}>
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 mt-1', config.color)} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className={cn('font-medium', config.color)}>{config.label}</h2>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {systemHealth}% healthy
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>

          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div className="text-green-600 dark:text-green-400">{activeAgents} active</div>
            <div className="text-yellow-600 dark:text-yellow-400">{pendingAgents} pending</div>
            <div className="text-red-600 dark:text-red-400">{errorAgents} errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};
