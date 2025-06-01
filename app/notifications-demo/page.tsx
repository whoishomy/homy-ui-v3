'use client';

import { NotificationFeed } from '@/components/notifications/NotificationFeed';

export default function NotificationsDemoPage() {
  return (
    <div className="min-h-screen p-4 bg-background">
      <h1 className="text-2xl font-semibold mb-4">📥 Notification Feed Demo</h1>
      <NotificationFeed />
    </div>
  );
}
