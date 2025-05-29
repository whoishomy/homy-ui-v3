/// <reference types="vitest" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProfileInfoCard } from '../ProfileInfoCard';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import type { UserProfile } from '@/store/user/userStore';

// Mock the hooks
vi.mock('@/hooks/useUser', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

const mockUser: UserProfile = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  language: 'tr',
  healthStatus: 'active',
  preferences: {
    notifications: true,
    darkMode: false,
    newsletter: true,
  },
};

const mockUpdateUser = vi.fn();
const mockToast = vi.fn();

describe('ProfileInfoCard', () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      updateUser: mockUpdateUser,
      updateLanguage: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
      toasts: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<ProfileInfoCard />);

    expect(screen.getByText('Profil Bilgileri')).toBeDefined();
    expect(screen.getByDisplayValue(mockUser.fullName)).toBeDefined();
    expect(screen.getByDisplayValue(mockUser.email)).toBeDefined();
  });

  it('starts in non-editing mode with disabled fields', () => {
    render(<ProfileInfoCard />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('enables editing mode when edit button is clicked', async () => {
    render(<ProfileInfoCard />);

    const editButton = screen.getByLabelText('Profili düzenle');
    await userEvent.click(editButton);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeEnabled();
    });
  });

  it('shows validation errors for invalid input', async () => {
    render(<ProfileInfoCard />);

    // Enable editing mode
    const editButton = screen.getByLabelText('Profili düzenle');
    await userEvent.click(editButton);

    // Clear and type invalid values
    const nameInput = screen.getByLabelText('Ad Soyad');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'a'); // Too short

    const emailInput = screen.getByLabelText('E-posta');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');

    const saveButton = screen.getByText('Kaydet');
    await userEvent.click(saveButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText('İsim en az 2 karakter olmalıdır')).toBeDefined();
      expect(screen.getByText('Geçerli bir e-posta adresi giriniz')).toBeDefined();
    });
  });

  it('successfully updates profile with valid data', async () => {
    render(<ProfileInfoCard />);

    // Enable editing mode
    const editButton = screen.getByLabelText('Profili düzenle');
    await userEvent.click(editButton);

    // Update values
    const nameInput = screen.getByLabelText('Ad Soyad');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');

    // Submit form
    const saveButton = screen.getByText('Kaydet');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: mockUser.email,
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Profil güncellendi',
        description: 'Bilgileriniz başarıyla kaydedildi.',
        type: 'success',
        duration: 3000,
      });
    });
  });

  it('handles API errors gracefully', async () => {
    mockUpdateUser.mockRejectedValueOnce(new Error('API Error'));

    render(<ProfileInfoCard />);

    // Enable editing mode
    const editButton = screen.getByLabelText('Profili düzenle');
    await userEvent.click(editButton);

    // Make a small change
    const nameInput = screen.getByLabelText('Ad Soyad');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');

    // Submit form
    const saveButton = screen.getByText('Kaydet');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Hata',
        description: 'Profil güncellenirken bir hata oluştu.',
        type: 'error',
        duration: 5000,
      });
    });
  });

  it('cancels editing and resets form values', async () => {
    render(<ProfileInfoCard />);

    // Enable editing mode
    const editButton = screen.getByLabelText('Profili düzenle');
    await userEvent.click(editButton);

    // Make changes
    const nameInput = screen.getByLabelText('Ad Soyad');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');

    // Cancel editing
    const cancelButton = screen.getByText('İptal');
    await userEvent.click(cancelButton);

    // Check if values are reset
    expect(screen.getByDisplayValue(mockUser.fullName)).toBeDefined();
    expect(screen.queryByDisplayValue('Jane Doe')).toBeNull();

    // Check if editing mode is disabled
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
}); 