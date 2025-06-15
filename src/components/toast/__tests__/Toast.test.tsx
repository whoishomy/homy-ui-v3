import { describe, it, expect, jest  } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';
import type { Toast as ToastType } from '@/types/toast';

describe('Toast', () => {
  const mockToast: ToastType = {
    id: '1',
    message: 'Test message',
    type: 'info',
    variant: 'default',
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders toast message correctly', () => {
    render(<Toast toast={mockToast} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onClose handler when close button is clicked', () => {
    render(<Toast toast={mockToast} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /kapat/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls both component and toast onClose handlers', () => {
    const toastOnClose = jest.fn();
    const toastWithCallback = {
      ...mockToast,
      onClose: toastOnClose,
    };

    render(<Toast toast={toastWithCallback} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /kapat/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(toastOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders without onClose handler', () => {
    render(<Toast toast={mockToast} />);
    const closeButton = screen.getByRole('button', { name: /kapat/i });
    fireEvent.click(closeButton);
    // Should not throw any errors
  });
}); 