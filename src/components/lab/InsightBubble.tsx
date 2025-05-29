'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronRight, AlertCircle, TrendingUp, Brain } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AIGeneratedInsight } from '@/types/health-report';

interface InsightBubbleProps {
  insights: AIGeneratedInsight[];
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxHeight?: string;
}

const InsightIcon = ({ type }: { type: AIGeneratedInsight['type'] }) => {
  switch (type) {
    case 'summary':
      return <Brain className="w-4 h-4" />;
    case 'recommendation':
      return <Sparkles className="w-4 h-4" />;
    case 'alert':
      return <AlertCircle className="w-4 h-4" />;
    case 'trend':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const InsightCard = ({ insight }: { insight: AIGeneratedInsight }) => {
  return (
    <div className="p-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'p-1.5 rounded-lg',
            insight.type === 'alert'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : insight.type === 'recommendation'
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              : insight.type === 'trend'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          )}
        >
          <InsightIcon type={insight.type} />
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-sm text-gray-900 dark:text-white">{insight.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{Math.round(insight.confidence * 100)}% güven</span>
              <span>•</span>
              <span>{new Date(insight.timestamp).toLocaleDateString('tr-TR')}</span>
            </div>
            {insight.sourceData && insight.sourceData.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{insight.sourceData.length} kaynak</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InsightBubble = ({
  insights,
  className,
  position = 'right',
  maxHeight = '400px',
}: InsightBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!insights || insights.length === 0) return null;

  return (
    <div className={cn('relative inline-block', className)} ref={bubbleRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-full transition-colors',
          isOpen
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        )}
        aria-label="AI İçgörülerini Göster"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            position === 'top' && 'bottom-full mb-2',
            position === 'bottom' && 'top-full mt-2',
            position === 'left' && 'right-full mr-2',
            position === 'right' && 'left-full ml-2'
          )}
          style={{ maxHeight }}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-500" />
              AI İçgörüleri
            </h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 48px)` }}>
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
