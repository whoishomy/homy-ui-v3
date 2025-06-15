import React, { useEffect } from 'react';
import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast';
import { useToast } from '@/hooks/useToast';

interface ToastProviderProps {
  children: React.ReactNode;
  autoShowToast?: boolean;
}

export function ToastProvider({ children, autoShowToast = false }: ToastProviderProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (autoShowToast) {
      toast({
        title: 'Test Toast',
        description: 'From screenshot',
        duration: 50000, // Keep it visible longer for screenshots
      });
    }
  }, [autoShowToast, toast]);

  return <RadixToastProvider>{children}</RadixToastProvider>;
}
