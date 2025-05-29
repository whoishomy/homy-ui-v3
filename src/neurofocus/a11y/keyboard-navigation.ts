import { useEffect, useRef, KeyboardEvent } from 'react';

interface KeyboardNavConfig {
  focusableSelector: string;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

/**
 * Custom hook for managing keyboard navigation
 * Implements WCAG 2.1 Success Criterion 2.1.1 (Keyboard) and 2.1.2 (No Keyboard Trap)
 */
export function useKeyboardNavigation({
  focusableSelector,
  onEscape,
  onEnter,
  onArrowKeys,
}: KeyboardNavConfig) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusableElements = Array.from(
        container.querySelectorAll(focusableSelector)
      ) as HTMLElement[];

      const currentFocusIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case 'Tab':
          if (event.shiftKey && currentFocusIndex === 0) {
            // Allow natural tab order to continue outside the container
            return;
          }
          if (!event.shiftKey && currentFocusIndex === focusableElements.length - 1) {
            // Allow natural tab order to continue outside the container
            return;
          }
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
          focusableElements[nextIndex]?.focus();
          onArrowKeys?.('down');
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex =
            (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
          focusableElements[prevIndex]?.focus();
          onArrowKeys?.('up');
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          onEnter?.();
          break;

        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown as any);
    return () => container.removeEventListener('keydown', handleKeyDown as any);
  }, [focusableSelector, onEscape, onEnter, onArrowKeys]);

  return containerRef;
}

/**
 * Utility function to ensure proper focus management
 * Implements WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 */
export function setInitialFocus(container: HTMLElement | null) {
  if (!container) return;

  // First try to find an element with autofocus
  const autofocusElement = container.querySelector('[autofocus]') as HTMLElement;
  if (autofocusElement) {
    autofocusElement.focus();
    return;
  }

  // Then try to find the first focusable element
  const firstFocusable = container.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as HTMLElement;

  if (firstFocusable) {
    firstFocusable.focus();
  }
}

/**
 * Utility function to create a focus trap
 * Ensures modal dialogs and important messages maintain focus
 */
export function createFocusTrap(container: HTMLElement | null) {
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  function trapFocus(e: Event) {
    const event = e as KeyboardEvent;
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  container.addEventListener('keydown', trapFocus);
  return () => container.removeEventListener('keydown', trapFocus);
}

/**
 * Utility function to announce messages to screen readers
 * Implements WCAG 2.1 Success Criterion 4.1.3 (Status Messages)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}
