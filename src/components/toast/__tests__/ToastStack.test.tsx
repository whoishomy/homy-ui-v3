import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastStack } from '../ToastStack';
import type { Toast } from '@/types/toast';
import { useToast } from '@/hooks/useToast';

// Mock useToast hook
jest.mock('@/hooks/useToast', () => ({
  useToast: jest.fn(),
}));

describe('ToastStack', () => {
  const mockToasts: Toast[] = [
    {
      id: '1',
      message: 'First toast',
      type: 'info',
      variant: 'default',
    },
    {
      id: '2',
      message: 'Second toast',
      type: 'success',
      variant: 'success',
    },
  ];

  const mockDismiss = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toasts: mockToasts,
      dismiss: mockDismiss,
    });
    mockDismiss.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders nothing when there are no toasts', () => {
      (useToast as jest.Mock).mockReturnValue({
        toasts: [],
        dismiss: mockDismiss,
      });

      const { container } = render(<ToastStack />);
      expect(container.firstChild).toBeNull();
    });

    it('renders multiple toasts correctly', () => {
      render(<ToastStack />);
      expect(screen.getByText('First toast')).toBeInTheDocument();
      expect(screen.getByText('Second toast')).toBeInTheDocument();
    });

    it('renders toasts in correct order', () => {
      render(<ToastStack />);
      const toastMessages = screen.getAllByText(/toast/i);
      expect(toastMessages[0]).toHaveTextContent('First toast');
      expect(toastMessages[1]).toHaveTextContent('Second toast');
    });
  });

  describe('User Interactions', () => {
    it('calls dismiss handler when close button is clicked', async () => {
      render(<ToastStack />);
      const closeButtons = screen.getAllByRole('button', { name: /kapat/i });
      await fireEvent.click(closeButtons[0]);
      expect(mockDismiss).toHaveBeenCalledWith('1');
    });

    it('handles keyboard dismiss with Escape key', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ToastStack />);
      await user.keyboard('[Escape]');
      expect(mockDismiss).toHaveBeenCalledWith('1');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ToastStack />);
      const container = screen.getByRole('region', { name: /bildirimler/i });
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ToastStack />);

      const closeButtons = screen.getAllByRole('button', { name: /kapat/i });
      closeButtons[0].focus();

      await user.keyboard('[Tab]');
      expect(closeButtons[1]).toHaveFocus();

      await user.keyboard('[Shift+Tab]');
      expect(closeButtons[0]).toHaveFocus();
    });
  });

  describe('Animation and Timing', () => {
    it('animates toasts on mount and unmount', async () => {
      const { rerender } = render(<ToastStack />);

      const toast = screen.getByText('First toast');
      expect(toast.parentElement).toHaveStyle({ opacity: 1 });

      (useToast as jest.Mock).mockReturnValue({
        toasts: [],
        dismiss: mockDismiss,
      });

      rerender(<ToastStack />);
      await waitFor(() => {
        expect(screen.queryByText('First toast')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive layout classes', () => {
      render(<ToastStack />);
      const container = screen.getByRole('region', { name: /bildirimler/i });
      expect(container).toHaveClass('fixed', 'inset-0', 'z-50', 'pointer-events-none');
    });

    it('applies correct spacing for toasts', () => {
      render(<ToastStack />);
      const container = screen.getByRole('region', { name: /bildirimler/i });
      expect(container).toHaveClass('flex', 'flex-col', 'items-end', 'gap-2', 'p-4', 'sm:p-6');
    });
  });
});
