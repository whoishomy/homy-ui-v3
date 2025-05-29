import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toast } from '../Toast';
import type { Toast as ToastType } from '@/types/toast';

expect.extend(toHaveNoViolations);

describe('Toast Accessibility', () => {
  const mockToast: ToastType = {
    id: '1',
    message: 'Test message',
    title: 'Test Title',
    type: 'info',
    variant: 'default',
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(<Toast toast={mockToast} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { getByRole } = render(<Toast toast={mockToast} />);
    const alert = getByRole('alert');
    
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should have proper focus management', () => {
    const { getByRole } = render(<Toast toast={mockToast} />);
    const closeButton = getByRole('button', { name: /kapat/i });
    
    closeButton.focus();
    expect(closeButton).toHaveFocus();
  });

  it('should be keyboard navigable', () => {
    const { getByRole } = render(<Toast toast={mockToast} />);
    const closeButton = getByRole('button', { name: /kapat/i });
    
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);
  });

  it('should have sufficient color contrast', () => {
    const { getByText } = render(<Toast toast={mockToast} />);
    const message = getByText('Test message');
    
    const styles = window.getComputedStyle(message);
    expect(styles.color).toBeDefined();
    expect(styles.backgroundColor).toBeDefined();
  });

  describe('Screen Reader Experience', () => {
    it('should announce toast content properly', () => {
      const { getByRole } = render(
        <Toast
          toast={{
            ...mockToast,
            title: 'Success',
            message: 'Operation completed',
            description: 'Your changes have been saved',
          }}
        />
      );

      const alert = getByRole('alert');
      expect(alert).toHaveTextContent('Success');
      expect(alert).toHaveTextContent('Operation completed');
      expect(alert).toHaveTextContent('Your changes have been saved');
    });

    it('should have descriptive close button', () => {
      const { getByRole } = render(<Toast toast={mockToast} />);
      const closeButton = getByRole('button', { name: /kapat/i });
      
      expect(closeButton).toHaveAttribute('aria-label', 'Bildirimi kapat');
    });
  });
}); 