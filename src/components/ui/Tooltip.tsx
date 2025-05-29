'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
  onTooltipShown?: (startTime: number) => void;
  onTooltipClicked?: () => void;
}

const tooltipAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 2 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 2,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className,
  onTooltipShown,
  onTooltipClicked,
}: TooltipProps) {
  const showTimeRef = useRef<number>(0);

  useEffect(() => {
    showTimeRef.current = Date.now();
  }, []);

  const handleTooltipOpen = () => {
    showTimeRef.current = Date.now();
  };

  const handleTooltipClosed = () => {
    if (onTooltipShown && showTimeRef.current) {
      onTooltipShown(showTimeRef.current);
    }
  };

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        onOpenChange={(open) => {
          if (open) {
            handleTooltipOpen();
          } else {
            handleTooltipClosed();
          }
        }}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <AnimatePresence>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side={side}
              align={align}
              asChild
              className={cn('z-50 overflow-hidden', className)}
              onClick={() => onTooltipClicked?.()}
            >
              <motion.div
                variants={tooltipAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 px-3 py-1.5 text-sm rounded-md shadow-lg"
              >
                {content}
                <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-800" />
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
