'use client';

import { useState } from 'react';
import { Send, Mic, Book, PenTool, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PracticeMode, SpeakFeedback, PracticeSession } from '@/types/speak-os';
import { ConversationDisplay } from './ConversationDisplay';

interface SpeakOSPanelProps {
  onCloseAction: () => void;
  className?: string;
}

export const SpeakOSPanel = ({ onCloseAction, className }: SpeakOSPanelProps) => {
  const [session, setSession] = useState<PracticeSession>({
    id: crypto.randomUUID(),
    mode: 'conversation',
    startedAt: new Date().toISOString(),
    messages: [],
  });
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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
    }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  return (
    <div
      className={cn('flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow', className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            SpeakOS
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeChange('conversation')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'conversation'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              <Book className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleModeChange('pitch')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'pitch'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleModeChange('technical')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                session.mode === 'technical'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              <PenTool className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ConversationDisplay messages={session.messages} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isRecording
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or start speaking..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                     px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 
                     dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim() && !isRecording}
            className={cn(
              'px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2',
              message.trim() || isRecording
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
