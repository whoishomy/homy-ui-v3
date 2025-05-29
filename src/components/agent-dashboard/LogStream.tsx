'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: string;
}

interface LogStreamProps {
  logs: LogEntry[];
  className?: string;
}

const logLevelColors = {
  info: 'text-blue-500 dark:text-blue-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
  debug: 'text-gray-500 dark:text-gray-400',
};

export const LogStream = ({ logs, className }: LogStreamProps) => {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('');

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.level.includes(filter.toLowerCase())
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-3 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <button
              onClick={() => toggleExpand(log.id)}
              className="w-full flex items-center p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {expandedLogs.has(log.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{log.timestamp}</span>
              <span className={cn('text-xs ml-2', logLevelColors[log.level])}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-sm ml-2 text-gray-900 dark:text-white">{log.message}</span>
            </button>
            {expandedLogs.has(log.id) && log.details && (
              <div className="px-8 py-2 text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-b-md">
                <pre>{log.details}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
