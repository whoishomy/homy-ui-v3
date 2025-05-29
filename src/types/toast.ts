export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  title?: string;
  description?: string;
  type?: ToastType;
  variant?: ToastVariant;
  duration?: number;
  createdAt?: number;
  onClose?: () => void;
} 