import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewStep } from '../ReviewStep';
import { toast } from '@/components/ui/Toast';
import {
  exportToPDF,
  exportToCSV,
  exportToICal,
  generateShareableLink,
} from '@/utils/exportUtils';
import { CarePlan } from '@/types/carePlan';

// Mock toast
jest.mock('@/components/ui/Toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock export utils
jest.mock('@/utils/exportUtils', () => ({
  exportToPDF: jest.fn(),
  exportToCSV: jest.fn(),
  exportToICal: jest.fn(),
  generateShareableLink: jest.fn(),
}));

describe('ReviewStep', () => {
  const mockData: Partial<CarePlan> = {
    title: 'Test Plan',
    status: 'draft',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    medications: [
      {
        id: '1',
        name: 'Test Med',
        dosage: 100,
        unit: 'mg',
        frequency: 'daily',
        startDate: new Date('2024-01-01'),
        reminder: true,
        notifyBeforeMinutes: 30,
      },
    ],
    goals: [
      {
        id: '1',
        title: 'Test Goal',
        status: 'in_progress',
        reminder: true,
        targetDate: new Date('2024-12-31'),
        targetValue: '70',
        category: 'weight',
        description: 'Test goal description',
      },
    ],
    metrics: [
      {
        id: '1',
        name: 'Test Metric',
        type: 'number',
        frequency: 'daily',
        reminder: true,
        notifyBeforeMinutes: 30,
        unit: 'kg',
        description: 'Test metric description',
      },
    ],
  };

  const mockProps = {
    data: mockData,
    onUpdate: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders plan summary correctly', () => {
    render(<ReviewStep {...mockProps} />);

    // Plan detayları
    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();

    // İlaçlar
    expect(screen.getByText(/Test Med/)).toBeInTheDocument();
    expect(screen.getByText(/100 mg/)).toBeInTheDocument();

    // Hedefler
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('in_progress')).toBeInTheDocument();

    // Metrikler
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
  });

  it('shows validation warnings for missing fields', () => {
    render(
      <ReviewStep
        {...mockProps}
        data={{
          status: 'draft',
        }}
      />
    );

    expect(screen.getByText('Eksik Bilgiler')).toBeInTheDocument();
    expect(screen.getByText('Plan başlığı')).toBeInTheDocument();
    expect(screen.getByText('Başlangıç tarihi')).toBeInTheDocument();
    expect(screen.getByText('İlaç bilgileri')).toBeInTheDocument();
    expect(screen.getByText('Sağlık hedefleri')).toBeInTheDocument();
    expect(screen.getByText('Takip metrikleri')).toBeInTheDocument();
  });

  it('handles PDF export correctly', async () => {
    render(<ReviewStep {...mockProps} />);

    const pdfButton = screen.getByText('PDF Dosyası').closest('button');
    fireEvent.click(pdfButton!);

    await waitFor(() => {
      expect(exportToPDF).toHaveBeenCalledWith(mockData);
      expect(toast.success).toHaveBeenCalledWith(
        'Plan başarıyla dışa aktarıldı'
      );
    });
  });

  it('handles CSV export correctly', async () => {
    render(<ReviewStep {...mockProps} />);

    const csvButton = screen.getByText('CSV Dosyası').closest('button');
    fireEvent.click(csvButton!);

    await waitFor(() => {
      expect(exportToCSV).toHaveBeenCalledWith(mockData);
      expect(toast.success).toHaveBeenCalledWith(
        'Plan başarıyla dışa aktarıldı'
      );
    });
  });

  it('handles iCal export correctly', async () => {
    render(<ReviewStep {...mockProps} />);

    const icalButton = screen.getByText('iCal Takvimi').closest('button');
    fireEvent.click(icalButton!);

    await waitFor(() => {
      expect(exportToICal).toHaveBeenCalledWith(mockData);
      expect(toast.success).toHaveBeenCalledWith(
        'Plan başarıyla dışa aktarıldı'
      );
    });
  });

  it('handles share link generation correctly', async () => {
    const mockShareableLink = 'https://example.com/share/123';
    (generateShareableLink as jest.Mock).mockResolvedValueOnce(mockShareableLink);

    // Mock clipboard API
    const mockClipboard = {
      writeText: jest.fn().mockResolvedValueOnce(undefined),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(<ReviewStep {...mockProps} />);

    const shareButton = screen.getByText('Paylaşım Linki Oluştur');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(generateShareableLink).toHaveBeenCalledWith(mockData);
      expect(mockClipboard.writeText).toHaveBeenCalledWith(mockShareableLink);
      expect(toast.success).toHaveBeenCalledWith('Paylaşım linki kopyalandı');
    });
  });

  it('handles export errors correctly', async () => {
    (exportToPDF as jest.Mock).mockRejectedValueOnce(new Error('Export failed'));

    render(<ReviewStep {...mockProps} />);

    const pdfButton = screen.getByText('PDF Dosyası').closest('button');
    fireEvent.click(pdfButton!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Dışa aktarma sırasında bir hata oluştu'
      );
    });
  });

  it('handles share link errors correctly', async () => {
    (generateShareableLink as jest.Mock).mockRejectedValueOnce(
      new Error('Share failed')
    );

    render(<ReviewStep {...mockProps} />);

    const shareButton = screen.getByText('Paylaşım Linki Oluştur');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Link oluşturulurken bir hata oluştu'
      );
    });
  });

  it('navigates correctly', () => {
    render(<ReviewStep {...mockProps} />);

    const backButton = screen.getByText('Geri');
    const nextButton = screen.getByText('Planı Tamamla');

    fireEvent.click(backButton);
    expect(mockProps.onPrevious).toHaveBeenCalled();

    fireEvent.click(nextButton);
    expect(mockProps.onNext).toHaveBeenCalled();
  });

  // A11y tests
  it('meets accessibility requirements', async () => {
    const { container } = render(<ReviewStep {...mockProps} />);

    // Check for ARIA labels
    expect(screen.getByRole('button', { name: 'Geri' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Planı Tamamla' })
    ).toBeInTheDocument();

    // Check for semantic HTML structure
    expect(container.querySelector('h3')).toBeInTheDocument();
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toBeInTheDocument();
    expect(container.querySelector('dd')).toBeInTheDocument();

    // Check for list accessibility
    const lists = container.querySelectorAll('ul');
    lists.forEach((list) => {
      expect(list.children.length).toBeGreaterThan(0);
      Array.from(list.children).forEach((item) => {
        expect(item.tagName.toLowerCase()).toBe('li');
      });
    });
  });
}); 