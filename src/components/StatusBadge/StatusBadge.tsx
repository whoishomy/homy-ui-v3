import React from 'react';

type StatusType = 'critical' | 'warning' | 'normal';

const getStatusClasses = (status: StatusType) => {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'normal':
      return 'bg-green-100 text-green-800';
  }
};

export interface StatusBadgeProps {
  status: StatusType;
  label: string;
  ariaLabel?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'normal',
  label,
  ariaLabel,
  interactive = false,
  onClick,
}) => {
  const statusClasses = getStatusClasses(status);
  const interactiveClasses = interactive
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2'
    : '';
  const classes = `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses} ${interactiveClasses}`;

  return (
    <span
      role="status"
      className={classes}
      aria-label={ariaLabel || label}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {label}
    </span>
  );
};
