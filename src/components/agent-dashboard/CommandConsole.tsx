'use client';

import { useState, KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import { Terminal, Send } from 'lucide-react';

interface CommandConsoleProps {
  onCommand: (command: string) => void;
  className?: string;
}

export const CommandConsole = ({ onCommand, className }: CommandConsoleProps) => {
  const [command, setCommand] = useState('');

  const handleSubmit = () => {
    if (command.trim()) {
      onCommand(command.trim());
      setCommand('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex-shrink-0">
        <Terminal className="h-5 w-5 text-gray-500" />
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command (e.g., 'run insight for Eren', 'reboot notifier')..."
          className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!command.trim()}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-green-500',
          !command.trim() && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Send className="h-5 w-5 text-gray-500" />
        <span className="sr-only">Send command</span>
      </button>
    </div>
  );
};
