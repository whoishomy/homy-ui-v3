import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ReminderScheduler } from '../ReminderScheduler';
import { useReminderStore } from '@/stores/reminderStore';
import type { Reminder } from '@/types/reminder';
import { useToast } from '@/hooks/useToast';
import type { Mock } from 'vitest';

// Mock dependencies
vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

const mockStore = {
  addReminder: vi.fn(),
};

vi.mock('@/stores/reminderStore', () => ({
  useReminderStore: vi.fn(() => mockStore),
}));

// Mock date for consistent testing
const mockDate = new Date('2025-05-25T10:00:00.000Z');
vi.setSystemTime(mockDate);

describe('ReminderScheduler', () => {
  const user = userEvent.setup();
  const mockToast = vi.fn();

  beforeEach(() => {
    mockStore.addReminder.mockClear();
    (useToast as Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<ReminderScheduler />);

    // Check for form fields
    expect(screen.getByRole('textbox', { name: /başlık/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /açıklama/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /kategori/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tarih/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/saat/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /tekrar/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ReminderScheduler />);

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /kaydet/i }));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/başlık gereklidir/i)).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    render(<ReminderScheduler />);

    // Fill form fields
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'Test Reminder');
    await user.type(screen.getByRole('textbox', { name: /açıklama/i }), 'Test Description');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /kaydet/i }));

    // Check if reminder was added
    await waitFor(() => {
      expect(mockStore.addReminder).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Reminder',
          description: 'Test Description',
        })
      );
    });

    // Check success toast
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hatırlatıcı oluşturuldu',
        variant: 'success',
      })
    );
  });

  it('shows end date field for recurring reminders', async () => {
    render(<ReminderScheduler />);

    // Select recurring frequency
    const frequencyButton = screen.getByRole('combobox', { name: /tekrar/i });
    await user.click(frequencyButton);
    await user.click(screen.getByRole('option', { name: /her gün/i }));

    // Check if end date field appears
    expect(screen.getByText(/bitiş tarihi/i)).toBeInTheDocument();
  });

  it('handles push notification toggle', async () => {
    render(<ReminderScheduler />);

    const pushToggle = screen.getByRole('switch', { name: /push bildirimleri/i });
    await user.click(pushToggle);

    expect(pushToggle).toBeChecked();
  });

  it('handles form submission errors', async () => {
    mockStore.addReminder.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    render(<ReminderScheduler />);

    // Fill and submit form
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'Test Reminder');
    await user.click(screen.getByRole('button', { name: /kaydet/i }));

    // Check error toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Hata',
          variant: 'error',
        })
      );
    });
  });
}); 