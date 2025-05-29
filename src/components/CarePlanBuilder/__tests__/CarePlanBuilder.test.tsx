import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarePlanBuilder } from '../CarePlanBuilder';
import { Toast } from '@/components/toast/Toast';
import { useCarePlanStore } from '@/store/carePlanStore';

// Mock the store
jest.mock('@/store/carePlanStore', () => ({
  useCarePlanStore: jest.fn(),
}));

// Mock toast
jest.mock('@/components/toast/Toast', () => ({
  Toast: jest.fn(() => null),
}));

describe('CarePlanBuilder', () => {
  const mockCreateCarePlan = jest.fn();
  const mockOnComplete = jest.fn();
  const mockOnCancel = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCarePlanStore as unknown as jest.Mock).mockReturnValue({
      createCarePlan: mockCreateCarePlan,
      showToast: mockShowToast,
    });
  });

  it('renders all steps in the progress bar', () => {
    render(<CarePlanBuilder />);

    expect(screen.getByText('Temel Bilgiler')).toBeInTheDocument();
    expect(screen.getByText('İlaçlar')).toBeInTheDocument();
    expect(screen.getByText('Randevular')).toBeInTheDocument();
    expect(screen.getByText('Hedefler')).toBeInTheDocument();
    expect(screen.getByText('Metrikler')).toBeInTheDocument();
    expect(screen.getByText('Gözden Geçirme')).toBeInTheDocument();
  });

  it('starts with the first step', () => {
    render(<CarePlanBuilder />);

    expect(screen.getByText('Bakım planının temel bilgilerini girin')).toBeInTheDocument();
    expect(screen.queryByText('İlaç tedavisi planlaması')).not.toBeInTheDocument();
  });

  it('navigates to next step when clicking continue', async () => {
    render(<CarePlanBuilder />);

    const nextButton = screen.getByText('Devam Et');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('İlaç tedavisi planlaması')).toBeInTheDocument();
    });
  });

  it('navigates to previous step when clicking back', async () => {
    render(<CarePlanBuilder initialStep={1} />);

    const backButton = screen.getByText('Geri');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Bakım planının temel bilgilerini girin')).toBeInTheDocument();
    });
  });

  it('calls onCancel when clicking cancel button', () => {
    render(<CarePlanBuilder onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('İptal');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('persists data between steps', async () => {
    render(<CarePlanBuilder />);

    // Fill basic info
    await userEvent.type(screen.getByPlaceholderText(/Plan başlığı/), 'Test Plan');
    fireEvent.click(screen.getByText('Devam Et'));

    // Navigate back
    await waitFor(() => {
      fireEvent.click(screen.getByText('Geri'));
    });

    // Check if data persists
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Plan')).toBeInTheDocument();
    });
  });

  it('shows complete button on last step', async () => {
    render(<CarePlanBuilder initialStep={5} />);

    expect(screen.getByText('Planı Tamamla')).toBeInTheDocument();
    expect(screen.queryByText('Devam Et')).not.toBeInTheDocument();
  });

  it('creates care plan when completing', async () => {
    mockCreateCarePlan.mockResolvedValueOnce({ id: 'test-id' });

    render(<CarePlanBuilder onComplete={mockOnComplete} initialStep={5} />);

    const completeButton = screen.getByText('Planı Tamamla');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockCreateCarePlan).toHaveBeenCalled();
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-id' }));
    });
  });

  it('handles care plan creation errors', async () => {
    mockCreateCarePlan.mockRejectedValueOnce(new Error('Test error'));

    render(<CarePlanBuilder initialStep={5} />);

    const completeButton = screen.getByText('Planı Tamamla');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.any(String),
        })
      );
    });
  });

  // Responsive tests
  it('maintains responsive layout on different screen sizes', () => {
    const { container } = render(<CarePlanBuilder />);

    // Test for responsive classes
    expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
    expect(container.querySelector('.px-4')).toBeInTheDocument();
  });

  // A11y tests
  it('meets accessibility requirements', () => {
    render(<CarePlanBuilder />);

    // Check for ARIA labels in navigation
    expect(screen.getByRole('button', { name: 'İptal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Devam Et' })).toBeInTheDocument();

    // Check progress indicators
    const progressSteps = screen.getAllByText(/\d/);
    progressSteps.forEach((step) => {
      expect(step).toHaveAttribute('aria-current', expect.any(String));
    });
  });
});
