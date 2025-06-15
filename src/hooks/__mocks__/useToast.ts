import { useState } from 'react';
import type { ToastType } from '@/types/Toast';

interface Toast {
  id: string;
  message: string | { message: string };
  type: ToastType | { id: string };
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (
    message: string | { message: string },
    type: ToastType | { id: string } = 'info',
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 6);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };
}

export const useToast = jest.fn().mockReturnValue({
  toast: jest.fn(),
  dismiss: jest.fn(),
  dismissAll: jest.fn(),
});
