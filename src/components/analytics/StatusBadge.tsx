import React from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

interface StatusBadgeProps {
  status: 'up' | 'degraded' | 'down';
  className?: string;
  tooltip?: string;
}

const getStatusLabel = (status: StatusBadgeProps['status']): string => {
  switch (status) {
    case 'up':
      return 'Operational';
    case 'degraded':
      return 'Performance Issues';
    case 'down':
      return 'Service Disruption';
    default:
      return 'Unknown Status';
  }
};

export function StatusBadge({ status, className = '', tooltip }: StatusBadgeProps) {
  const label = getStatusLabel(status);
  
  return (
    <Tooltip content={tooltip || label}>
      <div className="inline-flex items-center">
        <span
          className={`w-3 h-3 rounded-full ${className} mr-2`}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </Tooltip>
  );
} 