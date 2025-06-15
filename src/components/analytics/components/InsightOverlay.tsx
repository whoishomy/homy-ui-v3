'use client';

import React, { FC, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { Insight } from '@/cases/tayfun/insights';
import { useKeyboardNavigation } from '@/neurofocus/a11y/keyboard-navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightOverlayProps {
  insights: Insight[];
  onClose: () => void;
  className?: string;
}

export const InsightOverlay: FC<InsightOverlayProps> = ({ insights, onClose, className }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('analytics');

  // Keyboard navigation setup
  const containerRef = useKeyboardNavigation<HTMLDivElement>({
    focusableSelector: 'button, [tabindex="0"]',
    onEscape: onClose,
    onArrowKeys: (direction) => {
      const focusableElements = overlayRef.current?.querySelectorAll('button, [tabindex="0"]');
      if (!focusableElements) return;

      const currentFocusIndex = Array.from(focusableElements).indexOf(
        document.activeElement as HTMLElement
      );
      const newIndex = direction === 'down' ? currentFocusIndex + 1 : currentFocusIndex - 1;

      if (newIndex >= 0 && newIndex < focusableElements.length) {
        (focusableElements[newIndex] as HTMLElement).focus();
      }
    },
  });

  // Focus management
  useEffect(() => {
    closeButtonRef.current?.focus();

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (!overlayRef.current) return;

      const focusableElements = overlayRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  // Motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.2 },
  };

  const contentAnimation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.2 },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-overlay-title"
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center',
          className
        )}
        {...overlayAnimation}
      >
        <motion.div
          ref={containerRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6"
          {...contentAnimation}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              id="insight-overlay-title"
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {t('insights.title', 'İçgörü Telemetrisi')}
            </h2>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={t('common.close', 'Kapat')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">{t('common.close', 'Kapat')}</span>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div
            className="space-y-4"
            role="region"
            aria-label={t('insights.list_description', 'Sağlık içgörüleri listesi')}
          >
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                className={cn(
                  'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border',
                  'border-gray-200 dark:border-gray-700',
                  'focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none'
                )}
                tabIndex={0}
                role="article"
                aria-labelledby={`insight-${index}-title`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3
                  id={`insight-${index}-title`}
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  {insight.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{insight.description}</p>
                <div className="mt-3 flex items-center">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      {
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                          insight.severity === 'high',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                          insight.severity === 'medium',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                          insight.severity === 'low',
                      }
                    )}
                    role="status"
                    aria-label={`Öncelik: ${
                      insight.severity === 'high'
                        ? 'Yüksek'
                        : insight.severity === 'medium'
                        ? 'Orta'
                        : 'Düşük'
                    }`}
                  >
                    {insight.severity === 'high'
                      ? 'Yüksek'
                      : insight.severity === 'medium'
                      ? 'Orta'
                      : 'Düşük'}{' '}
                    Öncelik
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
