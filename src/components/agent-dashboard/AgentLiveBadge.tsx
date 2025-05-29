'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AgentLiveBadgeProps {
  startTime: string;
  isActive: boolean;
  className?: string;
}

export const AgentLiveBadge = ({ startTime, isActive, className }: AgentLiveBadgeProps) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const formatElapsedTime = (ms: number) => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      }
      return `${seconds}s`;
    };

    const updateElapsedTime = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const elapsed = now - start;
      setElapsedTime(formatElapsedTime(elapsed));
    };

    // Initial update
    updateElapsedTime();

    // Update every second if active
    const interval = isActive ? setInterval(updateElapsedTime, 1000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isActive]);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium',
        isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400',
        className
      )}
    >
      <Activity className="w-3.5 h-3.5" />
      <span>{isActive ? `Active for ${elapsedTime}` : `Last active ${elapsedTime} ago`}</span>
    </div>
  );
};
