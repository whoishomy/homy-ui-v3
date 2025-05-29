import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  update: (id: string, toast: Partial<Toast>) => void;
  clear: () => void;
}

export const toastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  update: (id, toast) =>
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...toast } : t)),
    })),
  clear: () => set({ toasts: [] }),
})); 