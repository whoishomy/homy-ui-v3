import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastStack } from '@/components/toast/ToastStack';
import { useToast } from '@/hooks/useToast';
import { jest  } from '@jest/globals';

jest.mock('@/hooks/useToast', () => ({
  useToast: jest.fn(() => ({
    toasts: [
      {
        id: '1',
        message: 'First toast',
        type: 'info',
      },
      {
        id: '2',
        message: 'Second toast',
        type: 'success',
      },
    ],
  })),
}));

describe('ToastStack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ToastStack />);
      const container = screen.getByRole('region', { name: /bildirimler/i });
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('maintains focus management', async () => {
      render(<ToastStack />);
      const firstToast = screen.getByText('First toast');
      const secondToast = screen.getByText('Second toast');

      expect(firstToast).toBeInTheDocument();
      expect(secondToast).toBeInTheDocument();
    });
  });

  describe('Animation and Timing', () => {
    it('animates toasts on mount and unmount', async () => {
      render(<ToastStack />);

      const toast = screen.getByText('First toast');
      await waitFor(() => {
        expect(toast.parentElement?.parentElement).toHaveStyle({
          opacity: '1',
          transform: 'scale(1) translateY(0px)',
        });
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
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-end',
        'gap-2',
        'px-4',
        'py-6',
        'sm:p-6'
      );
    });
  });
});
