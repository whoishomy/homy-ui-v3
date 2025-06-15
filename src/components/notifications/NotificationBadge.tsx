'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationFeed } from './NotificationFeed';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationBadgeProps {
  count: number;
  onMarkAsRead: (ids: string[]) => void;
  notifications: Notification[];
  className?: string;
}

export function NotificationBadge({
  count,
  onMarkAsRead,
  notifications,
  className,
}: NotificationBadgeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      onMarkAsRead(unreadIds);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Mark all as read when closing
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      onMarkAsRead(unreadIds);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className={cn(
          'relative inline-flex items-center p-2 text-gray-400 hover:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-green-500'
        )}
        onClick={handleClick}
      >
        <Bell className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {count}
          </span>
        )}
      </button>

      {/* Notification Feed */}
      <NotificationFeed
        isOpen={isOpen}
        onClose={handleClose}
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
      />
    </div>
  );
}
