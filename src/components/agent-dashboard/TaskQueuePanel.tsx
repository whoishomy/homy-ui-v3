'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/stores/agentStore';
import { AgentTask } from '@/types/agent';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  XSquare,
  ChevronRight,
  Timer,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { TaskFilter, TaskFilters } from './TaskFilter';

interface TaskQueuePanelProps {
  agentId: string;
  className?: string;
}

const taskStatusConfig = {
  pending: {
    icon: Clock,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    label: 'Pending',
  },
  running: {
    icon: Timer,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    label: 'Running',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-800',
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-800',
    label: 'Failed',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-800',
    label: 'Warning',
  },
};

export const TaskQueuePanel = ({ agentId, className }: TaskQueuePanelProps) => {
  const { tasks, updateTask, removeTask } = useAgentStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    type: [],
  });

  const agentTasks = tasks[agentId] || [];

  const filteredTasks = useMemo(() => {
    return agentTasks.filter((task) => {
      // Search filter
      if (
        filters.search &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.type.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(task.type)) {
        return false;
      }

      return true;
    });
  }, [agentTasks, filters]);

  const handleRetry = (taskId: string) => {
    const task = agentTasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(agentId, taskId, {
        error: undefined,
        startedAt: new Date().toISOString(),
      });
    }
  };

  const handleCancel = (taskId: string) => {
    removeTask(agentId, taskId);
  };

  const getTaskStatus = (task: AgentTask) => {
    if (task.error) return 'failed';
    if (task.completedAt) return 'completed';
    if (task.startedAt) return 'running';
    return 'pending';
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm', className)}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Queue</h2>
      </div>

      {/* Task Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <TaskFilter onFilterChange={setFilters} />
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const status = getTaskStatus(task);
            const config = taskStatusConfig[status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors',
                  task.id === selectedTaskId && 'bg-gray-50 dark:bg-gray-700/50'
                )}
                onClick={() => setSelectedTaskId(task.id === selectedTaskId ? null : task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        config.bgColor
                      )}
                    >
                      <StatusIcon className={cn('w-4 h-4', config.color)} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {status === 'running' && 'Started at '}
                        {status === 'completed' && 'Completed at '}
                        {status === 'failed' && 'Failed at '}
                        {formatTime(task.startedAt || task.completedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {status === 'failed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(task.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 
                                 text-gray-400 hover:text-gray-500 dark:text-gray-500 
                                 dark:hover:text-gray-400 transition-colors"
                        aria-label="Retry task"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {(status === 'pending' || status === 'running') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(task.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 
                                 text-gray-400 hover:text-gray-500 dark:text-gray-500 
                                 dark:hover:text-gray-400 transition-colors"
                        aria-label="Cancel task"
                      >
                        <XSquare className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 text-gray-400 transition-transform',
                        task.id === selectedTaskId && 'transform rotate-90'
                      )}
                    />
                  </div>
                </div>

                {/* Task Details */}
                <AnimatePresence>
                  {task.id === selectedTaskId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pl-11 text-sm"
                    >
                      <div className="space-y-2 text-gray-600 dark:text-gray-300">
                        <p>
                          <span className="font-medium">Type:</span> {task.type}
                        </p>
                        {task.error && (
                          <p className="text-red-600 dark:text-red-400">
                            <span className="font-medium">Error:</span> {task.error}
                          </p>
                        )}
                        <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          {task.startedAt && <span>Started: {formatTime(task.startedAt)}</span>}
                          {task.completedAt && (
                            <span>Completed: {formatTime(task.completedAt)}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {agentTasks.length === 0 ? 'No tasks in queue' : 'No tasks match the current filters'}
          </div>
        )}
      </div>
    </div>
  );
};
