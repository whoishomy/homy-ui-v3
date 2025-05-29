'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /**
   * The URL of the avatar image
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * Fallback text/element to show when image fails to load
   */
  fallback?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      'ring-1 ring-gray-200 dark:ring-gray-700',
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      className={cn(
        'h-full w-full object-cover',
        'transition-opacity duration-300',
        'aspect-square'
      )}
    />
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center',
        'rounded-full bg-gray-100 dark:bg-gray-800',
        'text-sm font-medium uppercase',
        'text-gray-800 dark:text-gray-200'
      )}
      delayMs={600}
    >
      {typeof fallback === 'string' ? fallback.charAt(0) : fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = 'Avatar'; 