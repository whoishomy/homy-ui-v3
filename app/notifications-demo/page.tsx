'use client';

import { useState } from 'react';
import NotificationFeed, { Notification } from '@/components/NotificationFeed';

const demoNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Feature Available',
    message: 'Check out our latest AI-powered health tracking features!',
    timestamp: '2 minutes ago',
    isRead: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Health Report Ready',
    message: 'Your weekly health report has been generated.',
    timestamp: '1 hour ago',
    isRead: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Reminder',
    message: 'Time to update your health goals for the week.',
    timestamp: '2 hours ago',
    isRead: true,
    type: 'warning',
  },
];

export default function NotificationsDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState(demoNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <h1 className="text-2xl font-semibold mb-4">📥 Notification Feed Demo</h1>
      <NotificationFeed
        isOpen={isOpen}
        onCloseAction={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsReadAction={handleMarkAsRead}
      />
      {!isOpen && (
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          onClick={() => setIsOpen(true)}
        >
          Show Notifications
        </button>
      )}
    </div>
  );
}
