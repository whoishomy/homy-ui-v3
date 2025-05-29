import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toast } from './Toast';
import { useToast } from '@/hooks/useToast';

export const ToastStack = () => {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 px-4 py-6 sm:p-6"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <Toast toast={toast} onClose={() => dismiss(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 