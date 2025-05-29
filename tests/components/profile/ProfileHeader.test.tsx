import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { useUser } from '@/hooks/useUser';

// Mock the useUser hook
vi.mock('@/hooks/useUser', () => ({
  useUser: vi.fn(),
}));

const mockUser = {
  id: '1',
  fullName: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  language: 'tr',
  healthStatus: 'active' as const,
  preferences: {
    notifications: true,
    darkMode: false,
    newsletter: true,
  },
};

describe('ProfileHeader', () => {
  const mockLogout = vi.fn();
  const mockUpdateLanguage = vi.fn();
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    (useUser as any).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      updateLanguage: mockUpdateLanguage,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore window.location after each test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('Rendering', () => {
    it('renders user information correctly', () => {
      render(<ProfileHeader />);

      expect(screen.getByText(mockUser.fullName)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByAltText(`${mockUser.fullName} profil fotoğrafı`)).toBeInTheDocument();
    });

    it('renders action buttons with correct accessibility labels', () => {
      render(<ProfileHeader />);

      expect(screen.getByLabelText('Dil seçimi')).toBeInTheDocument();
      expect(screen.getByLabelText('Ayarlar')).toBeInTheDocument();
      expect(screen.getByLabelText('Çıkış yap')).toBeInTheDocument();
    });

    it('renders nothing when user is null', () => {
      (useUser as any).mockReturnValue({
        user: null,
        logout: mockLogout,
        updateLanguage: mockUpdateLanguage,
      });

      const { container } = render(<ProfileHeader />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Interactions', () => {
    it('calls logout when logout button is clicked', () => {
      render(<ProfileHeader />);

      const logoutButton = screen.getByLabelText('Çıkış yap');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('navigates to settings when settings button is clicked', () => {
      // Setup mock location with Object.defineProperty
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          ...window.location,
          href: '',
        },
      });

      render(<ProfileHeader />);

      const settingsButton = screen.getByLabelText('Ayarlar');
      fireEvent.click(settingsButton);

      expect(window.location.href).toBe('/settings');
    });

    it('calls updateLanguage when language is changed', () => {
      render(<ProfileHeader />);

      const languageSelector = screen.getByLabelText('Dil seçimi');
      fireEvent.change(languageSelector, { target: { value: 'en' } });

      expect(mockUpdateLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(<ProfileHeader />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('provides proper ARIA labels', () => {
      render(<ProfileHeader />);

      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('aria-label', 'Profil başlığı');
    });
  });

  describe('Styling', () => {
    it('applies custom className when provided', () => {
      const customClass = 'custom-header';
      render(<ProfileHeader className={customClass} />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass(customClass);
    });

    it('applies dark mode classes correctly', () => {
      render(<ProfileHeader />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700');
    });
  });
});
