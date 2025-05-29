'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AgentTaskType } from '@/types/agent';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
  className?: string;
}

export interface TaskFilters {
  search: string;
  status: string[];
  type: AgentTaskType[];
}

const statusOptions = ['pending', 'running', 'completed', 'failed'];
const typeOptions: AgentTaskType[] = ['process', 'analyze', 'notify', 'sync', 'custom'];

export const TaskFilter = ({ onFilterChange, className }: TaskFilterProps) => {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    type: [],
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const toggleStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleType = (type: AgentTaskType) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter((t) => t !== type) : [...prev.type, type],
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: [], type: [] });
    setIsExpanded(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 
                   dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 
                   focus:ring-green-500 dark:focus:ring-green-400"
        />
        {(filters.search || filters.status.length > 0 || filters.type.length > 0) && (
          <button
            onClick={clearFilters}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-white"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {(filters.status.length > 0 || filters.type.length > 0) && (
            <span
              className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-600 
                         dark:text-green-200 rounded-full text-xs"
            >
              {filters.status.length + filters.type.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full capitalize transition-colors',
                    filters.status.includes(status)
                      ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</h3>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full capitalize transition-colors',
                    filters.type.includes(type)
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
