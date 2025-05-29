"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/utils/cn";
import { NotificationFeed } from "./NotificationFeed";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface Props {
  notifications: Notification[];
  onMarkAsRead: (ids: string[]) => void;
  className?: string;
}

export const NotificationBadge = ({ notifications, onMarkAsRead, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Mark all as read when closing
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      onMarkAsRead(unreadIds);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "relative p-2 rounded-full transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-green-500",
          hasUnread && "animate-pulse"
        )}
        onClick={handleOpen}
        aria-label={`Bildirimler ${hasUnread ? `(${unreadCount} okunmamış)` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        
        {/* Unread Badge */}
        {hasUnread && (
          <span
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5",
              "flex items-center justify-center",
              "rounded-full bg-green-500 text-white",
              "text-xs font-medium",
              "animate-bounce"
            )}
            aria-hidden="true"
          >
            {unreadCount}
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
}; 