import { useCallback } from 'react';
import { toastStore, Toast } from './store';

interface ToastOptions {
  message: string;
  duration?: number;
  type?: Toast['type'];
}

interface PromiseToastOptions {
  loading: string;
  success: string;
  error: string;
  duration?: number;
}

export const useToast = () => {
  const show = useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}`;
    toastStore.getState().add({
      id,
      ...options,
      duration: options.duration ?? 5000,
    });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    toastStore.getState().remove(id);
  }, []);

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    toastStore.getState().update(id, options);
  }, []);

  const clearAll = useCallback(() => {
    toastStore.getState().clear();
  }, []);

  const promise = useCallback(
    async <T>(
      promise: Promise<T>,
      options: PromiseToastOptions
    ): Promise<T> => {
      const toastId = show({
        message: options.loading,
        duration: options.duration,
        type: 'info',
      });

      try {
        const result = await promise;
        update(toastId, {
          message: options.success,
          type: 'success',
        });
        return result;
      } catch (error) {
        update(toastId, {
          message: options.error,
          type: 'error',
        });
        throw error;
      }
    },
    [show, update]
  );

  return {
    show,
    dismiss,
    update,
    clearAll,
    promise,
  };
}; 