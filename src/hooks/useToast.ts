import { create } from 'zustand';
import type { Toast } from '@/types/toast';

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const MAX_TOASTS = 5;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [toast, ...state.toasts].slice(0, MAX_TOASTS),
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t: Toast) => t.id !== id),
    })),
  removeAllToasts: () => set({ toasts: [] }),
}));

export const useToast = () => {
  const { toasts, addToast, removeToast, removeAllToasts } = useToastStore();

  const toast = (message: string | Omit<Toast, 'id'>, options: Partial<Toast> = {}) => {
    const id = crypto.randomUUID();
    const duration = typeof options === 'object' ? options.duration ?? 5000 : 5000;

    const toastData: Toast = {
      id,
      message: typeof message === 'string' ? message : message.message,
      type: options.type || 'info',
      duration,
      createdAt: Date.now(),
      ...options,
    };

    // Update existing toast or add new one
    const existingToastIndex = toasts.findIndex((t) => t.id === options.id);
    if (existingToastIndex !== -1) {
      const updatedToasts = [...toasts];
      updatedToasts[existingToastIndex] = { ...toastData, id: options.id! };
      addToast(updatedToasts[existingToastIndex]);
    } else {
      addToast(toastData);
    }

    // Set auto-dismiss timeout
    if (duration > 0) {
      setTimeout(() => {
        removeToast(options.id || id);
      }, duration);
    }

    return id;
  };

  const dismiss = (id: string) => {
    removeToast(id);
  };

  const dismissAll = () => {
    removeAllToasts();
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  };
}; 