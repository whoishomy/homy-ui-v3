'use client';

import { useState, useEffect } from 'react';
import { CursorBadge } from './cursor-badge';

export const CursorBadgeDemo = () => {
  const [currentState, setCurrentState] = useState<'think' | 'make' | 'do'>('think');

  useEffect(() => {
    // Simulate state transitions
    const states: ('think' | 'make' | 'do')[] = ['think', 'make', 'do'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setCurrentState(states[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cursor Badge States</h2>

      <div className="flex flex-wrap gap-4">
        <CursorBadge
          variant="think"
          className={currentState === 'think' ? 'animate-pulse' : 'opacity-50'}
        />
        <CursorBadge
          variant="make"
          className={currentState === 'make' ? 'animate-pulse' : 'opacity-50'}
        />
        <CursorBadge
          variant="do"
          className={currentState === 'do' ? 'animate-pulse' : 'opacity-50'}
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Current State:{' '}
        <span className="font-medium">
          {currentState.charAt(0).toUpperCase() + currentState.slice(1)}ing
        </span>
      </p>
    </div>
  );
};
