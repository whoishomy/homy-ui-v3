import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HealthMetricStep } from '../HealthMetricStep';
import { toast } from '@/components/ui/Toast';

// Mock toast
jest.mock('@/components/ui/Toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('HealthMetricStep', () => {
  const mockProps = {
    data: {
      metrics: [],
    },
    onUpdate: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial form with empty metric', () => {
    render(<HealthMetricStep {...mockProps} />);
    
    expect(screen.getByText('Metrik #1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Kan Şekeri, Nabız/)).toBeInTheDocument();
    expect(screen.getByText('Metrik Tipi')).toBeInTheDocument();
    expect(screen.getByText('Ölçüm Sıklığı')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<HealthMetricStep {...mockProps} />);
    
    // Try to submit without filling required fields
    const submitButton = screen.getByText('Devam Et');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Metrik adı en az 2 karakter olmalıdır')).toBeInTheDocument();
    });
  });

  it('adds new metric when clicking add button', () => {
    render(<HealthMetricStep {...mockProps} />);
    
    const addButton = screen.getByText('+ Yeni Metrik Ekle');
    fireEvent.click(addButton);
    
    expect(screen.getAllByText(/Metrik #/)).toHaveLength(2);
  });

  it('removes metric when clicking delete button', () => {
    render(<HealthMetricStep {...mockProps} />);
    
    // Add a new metric first
    const addButton = screen.getByText('+ Yeni Metrik Ekle');
    fireEvent.click(addButton);
    
    // Click delete on the second metric
    const deleteButtons = screen.getAllByText('Sil');
    fireEvent.click(deleteButtons[0]);
    
    expect(screen.getAllByText(/Metrik #/)).toHaveLength(1);
  });

  it('shows type-specific fields based on metric type', async () => {
    render(<HealthMetricStep {...mockProps} />);
    
    // Select 'range' type
    const typeSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(typeSelect, 'range');
    
    expect(screen.getByText('Minimum Değer')).toBeInTheDocument();
    expect(screen.getByText('Maximum Değer')).toBeInTheDocument();
    
    // Select 'options' type
    await userEvent.selectOptions(typeSelect, 'options');
    
    expect(screen.getByText('Seçenekler (Her satıra bir seçenek yazın)')).toBeInTheDocument();
  });

  it('handles reminder toggle correctly', () => {
    render(<HealthMetricStep {...mockProps} />);
    
    const reminderCheckbox = screen.getByRole('checkbox');
    
    // Initially reminder settings should be hidden
    expect(screen.queryByText('Hatırlatma Süresi (Dakika)')).not.toBeInTheDocument();
    
    // Show reminder settings when checked
    fireEvent.click(reminderCheckbox);
    expect(screen.getByText('Hatırlatma Süresi (Dakika)')).toBeInTheDocument();
    
    // Hide reminder settings when unchecked
    fireEvent.click(reminderCheckbox);
    expect(screen.queryByText('Hatırlatma Süresi (Dakika)')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<HealthMetricStep {...mockProps} />);
    
    // Fill form data
    await userEvent.type(screen.getByPlaceholderText(/Kan Şekeri, Nabız/), 'Kan Şekeri');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'number');
    await userEvent.type(screen.getByPlaceholderText(/mg\/dL, bpm/), 'mg/dL');
    
    // Submit form
    const submitButton = screen.getByText('Devam Et');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.arrayContaining([
            expect.objectContaining({
              name: 'Kan Şekeri',
              type: 'number',
              unit: 'mg/dL',
            }),
          ]),
        })
      );
      expect(mockProps.onNext).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Sağlık metrikleri kaydedildi');
    });
  });

  it('handles form submission errors', async () => {
    const errorMockProps = {
      ...mockProps,
      onUpdate: jest.fn().mockRejectedValue(new Error('Test error')),
    };
    
    render(<HealthMetricStep {...errorMockProps} />);
    
    // Fill form data
    await userEvent.type(screen.getByPlaceholderText(/Kan Şekeri, Nabız/), 'Kan Şekeri');
    
    // Submit form
    const submitButton = screen.getByText('Devam Et');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Sağlık metrikleri kaydedilirken hata oluştu');
    });
  });

  // A11y tests
  it('meets accessibility requirements', async () => {
    const { container } = render(<HealthMetricStep {...mockProps} />);
    
    // Check for ARIA labels
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Devam Et' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Geri' })).toBeInTheDocument();
    
    // Check for form controls accessibility
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });
}); 