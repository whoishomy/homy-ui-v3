import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '@/components/ui/Toast';
import { jest  } from '@jest/globals';

const mockToast = {
  id: '1',
  message: 'Test message',
  type: 'info' as const,
  duration: 3000,
};

describe('Toast', () => {
  describe('Rendering', () => {
    it('renders toast with correct message and type', () => {
      render(<Toast toast={mockToast} />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
    });

    it('renders dismiss button with accessibility features', () => {
      render(<Toast toast={mockToast} />);

      const dismissButton = screen.getByRole('button');
      expect(dismissButton).toBeInTheDocument();
      expect(screen.getByText('Dismiss toast')).toBeInTheDocument();
    });

    it('renders progress bar for non-zero duration toasts', () => {
      render(<Toast toast={mockToast} />);

      const progressBar = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ transition: `width ${mockToast.duration}ms linear` });
    });

    it('does not render progress bar for zero duration toasts', () => {
      const persistentToast = { ...mockToast, duration: 0 };
      render(<Toast toast={persistentToast} />);

      const progressBar = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(progressBar).not.toHaveStyle({ transition: expect.any(String) });
    });
  });

  describe('Type-based Styling', () => {
    const testCases = [
      { type: 'info', expectedClass: 'bg-blue-50' },
      { type: 'success', expectedClass: 'bg-green-50' },
      { type: 'warning', expectedClass: 'bg-yellow-50' },
      { type: 'error', expectedClass: 'bg-red-50' },
    ] as const;

    testCases.forEach(({ type, expectedClass }) => {
      it(`applies correct styling for ${type} type`, () => {
        const toast = { ...mockToast, type };
        render(<Toast toast={toast} />);

        expect(screen.getByRole('alert')).toHaveClass(expectedClass);
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Toast toast={mockToast} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('marks decorative elements as aria-hidden', () => {
      render(<Toast toast={mockToast} />);

      const decorativeElements = screen.getAllByLabelText('', { selector: '[aria-hidden="true"]' });
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('calls dismiss when close button is clicked', () => {
      const onDismiss = jest.fn();
      render(<Toast toast={mockToast} onDismiss={onDismiss} />);

      const dismissButton = screen.getByRole('button');
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
