'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ConversationSummary } from '@/types/conversation';

interface ConversationPanelProps {
  conversation?: ConversationSummary;
  onCloseAction: () => void;
  className?: string;
}

export const ConversationPanel = ({
  conversation,
  onCloseAction,
  className,
}: ConversationPanelProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: Implement message sending
    console.log('Sending message:', message);
    setMessage('');
  };

  if (!conversation) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {conversation.topic}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {conversation.agentName} • {conversation.messageCount} messages
          </p>
        </div>
        <button
          onClick={onCloseAction}
          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">{/* TODO: Implement message list */}</div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                     px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 
                     dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={cn(
              'px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2',
              message.trim()
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
