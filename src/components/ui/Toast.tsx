import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface ToastProps {
  toast: {
    id: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
  };
  onDismiss?: () => void;
}

const typeStyles = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <motion.div
      role="alert"
      aria-live="polite"
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${
        typeStyles[toast.type || 'info']
      }`}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss toast</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {toast.duration && toast.duration > 0 && (
        <div
          aria-hidden="true"
          className="h-1 bg-current opacity-20"
          style={{
            width: '100%',
            transition: `width ${toast.duration}ms linear`,
          }}
        />
      )}
    </motion.div>
  );
}
