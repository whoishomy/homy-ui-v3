'use client';

import { Fragment } from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PracticeSession, SpeakFeedback } from '@/types/speak-os';

interface ConversationDisplayProps {
  messages: PracticeSession['messages'];
  className?: string;
}

export const ConversationDisplay = ({ messages, className }: ConversationDisplayProps) => {
  const renderFeedback = (feedback: SpeakFeedback) => (
    <div className="mt-2 space-y-2 text-sm">
      {feedback.corrections.map((correction, index) => (
        <div key={index} className="pl-2 border-l-2 border-yellow-500">
          <p className="text-gray-500 dark:text-gray-400 line-through">{correction.original}</p>
          <p className="text-green-600 dark:text-green-400">{correction.improved}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{correction.explanation}</p>
        </div>
      ))}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {Object.entries(feedback.metrics).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {(value * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {messages.map((message, index) => (
        <Fragment key={message.id}>
          <div
            className={cn(
              'flex gap-3 p-4 rounded-lg',
              message.type === 'user'
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            )}
          >
            <div
              className={cn(
                'p-2 rounded-lg self-start',
                message.type === 'user'
                  ? 'bg-green-100 dark:bg-green-900/50'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              {message.feedback && renderFeedback(message.feedback)}
            </div>
          </div>
          {index < messages.length - 1 && (
            <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />
          )}
        </Fragment>
      ))}
    </div>
  );
};
