'use client';

import { useState } from 'react';
import { Sparkles, Presentation, MessageSquare, Code, Download, Play } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PracticeMode, PracticeSession } from '@/types/practice-agent';
import { ConversationDisplay } from '../speak-os/ConversationDisplay';

interface DevDayTrainerPanelProps {
  onCloseAction: () => void;
  className?: string;
}

export const DevDayTrainerPanel = ({ onCloseAction, className }: DevDayTrainerPanelProps) => {
  const [session, setSession] = useState<PracticeSession>({
    id: crypto.randomUUID(),
    mode: 'pitch',
    startedAt: new Date().toISOString(),
    messages: [],
    context: {
      topic: 'HomyOS Agent Network',
      audience: 'OpenAI DevRel Team',
      complexity: 'advanced',
    },
  });

  const [message, setMessage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: crypto.randomUUID(),
      content: message,
      type: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    setSession((prev: PracticeSession) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // TODO: Process with AI and get feedback
    setMessage('');
  };

  const handleModeChange = (newMode: PracticeMode) => {
    setSession((prev: PracticeSession) => ({
      ...prev,
      mode: newMode,
      messages: [],
      context: {
        ...prev.context,
        topic: getModeDefaultTopic(newMode),
      },
    }));
  };

  const getModeDefaultTopic = (mode: PracticeMode) => {
    switch (mode) {
      case 'pitch':
        return 'HomyOS Agent Network';
      case 'daily':
        return 'Technical Discussion';
      case 'explain':
        return 'LLM Architecture';
      default:
        return 'HomyOS Features';
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    // TODO: Start Lena simulation
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            DevDay Trainer
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeChange('pitch')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'pitch'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              title="Pitch Practice"
            >
              <Presentation className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleModeChange('daily')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'daily'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              title="Daily Conversation"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleModeChange('explain')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'explain'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              title="Technical Explanation"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {session.context?.topic} • {session.context?.audience}
          </div>
          <button
            onClick={() => {
              // TODO: Implement export
            }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ConversationDisplay messages={session.messages} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isSimulating ? (
          <button
            onClick={startSimulation}
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                     flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Practice with Lena (OpenAI DevRel)
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your feature or respond to question..."
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
              <Play className="w-4 h-4" />
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
