import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { Toast } from './Toast';

export function ToastStack() {
  const { toasts } = useToast();

  return (
    <div
      role="region"
      aria-label="Bildirimler"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 px-4 py-6 sm:p-6"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            layout
          >
            <Toast toast={toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
