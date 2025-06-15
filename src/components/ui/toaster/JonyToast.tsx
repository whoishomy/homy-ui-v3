import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success:
          'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-50',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
}

export function JonyToast({ className, variant, title, description, ...props }: ToastProps) {
  return (
    <ToastPrimitives.Provider>
      <ToastPrimitives.Root
        className={cn(toastVariants({ variant }), className)}
        {...props}
        duration={50000}
      >
        <div className="grid gap-1">
          {title && (
            <ToastPrimitives.Title className="text-sm font-semibold">{title}</ToastPrimitives.Title>
          )}
          {description && (
            <ToastPrimitives.Description className="text-sm opacity-90">
              {description}
            </ToastPrimitives.Description>
          )}
        </div>
      </ToastPrimitives.Root>
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  );
}
