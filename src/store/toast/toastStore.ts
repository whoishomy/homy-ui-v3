import { create } from "zustand";
import { StateCreator } from "zustand";

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  createdAt?: number;
  onClose?: () => void;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "createdAt">) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearAllToasts: () => void;
}

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 5000; // 5 seconds

export const useToastStore = create<ToastState>()((set): ToastState => ({
  toasts: [],
  
  addToast: (toast: Omit<Toast, "createdAt">) => set((state: ToastState) => {
    const existingToastIndex = state.toasts.findIndex(t => t.id === toast.id);
    const newToast: Toast = {
      ...toast,
      duration: toast.duration ?? DEFAULT_DURATION,
      createdAt: Date.now()
    };

    if (existingToastIndex !== -1) {
      // Update existing toast
      const updatedToasts = [...state.toasts];
      updatedToasts[existingToastIndex] = newToast;
      return { toasts: updatedToasts };
    }

    // Add new toast, maintaining MAX_TOASTS limit
    const updatedToasts = [newToast, ...state.toasts].slice(0, MAX_TOASTS);
    return { toasts: updatedToasts };
  }),

  removeToast: (id: string) => set((state: ToastState) => ({
    toasts: state.toasts.filter((toast: Toast) => toast.id !== id)
  })),

  updateToast: (id: string, updates: Partial<Toast>) => set((state: ToastState) => ({
    toasts: state.toasts.map((toast: Toast) =>
      toast.id === id ? { ...toast, ...updates } : toast
    )
  })),

  clearAllToasts: () => set({ toasts: [] })
})); 