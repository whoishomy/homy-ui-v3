'use client';

import { useState } from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface Props {
  isOpen: boolean;
  onCloseAction: () => void;
  notifications: Notification[];
  onMarkAsReadAction: (id: string) => void;
}

export default function NotificationFeed({
  isOpen,
  onCloseAction,
  notifications,
  onMarkAsReadAction,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-96 max-h-[80vh] overflow-y-auto bg-background border border-secondary rounded-md shadow-lg p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            className="p-2 hover:bg-secondary rounded-full"
            onClick={onCloseAction}
            aria-label="Close notifications"
          >
            <FaBell className="w-4 h-4" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-md bg-secondary ${notification.isRead ? 'opacity-70' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                  <button
                    className="p-1 hover:bg-accent rounded-full"
                    onClick={() => onMarkAsReadAction(notification.id)}
                    aria-label="Mark as read"
                  >
                    <FaCheck className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
