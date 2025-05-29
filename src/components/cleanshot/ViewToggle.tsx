'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
  className?: string;
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
        className
      )}
    >
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-2 rounded transition-colors',
          view === 'grid'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-2 rounded transition-colors',
          view === 'list'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        )}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
