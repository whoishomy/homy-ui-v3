import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  promiseToast: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => Promise<T>;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  promiseToast: async (promise, messages) => {
    const loadingId = useToastStore.getState().addToast({
      message: messages.loading,
      type: 'info',
    });

    try {
      const result = await promise;
      useToastStore.getState().removeToast(loadingId);
      useToastStore.getState().addToast({
        message: messages.success,
        type: 'success',
        duration: 3000,
      });
      return result;
    } catch (error) {
      useToastStore.getState().removeToast(loadingId);
      useToastStore.getState().addToast({
        message: messages.error,
        type: 'error',
        duration: 5000,
      });
      throw error;
    }
  },
}));

export const useToast = () => {
  const { addToast, removeToast, promiseToast, toasts } = useToastStore();

  return {
    toasts,
    toast: (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      return addToast({ message, type, duration });
    },
    dismiss: removeToast,
    promise: promiseToast,
  };
};
