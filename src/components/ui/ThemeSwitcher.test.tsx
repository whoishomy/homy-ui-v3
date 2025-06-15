import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useThemeStore } from '@/store/themeStore';
import { useTrademarkTheme } from '@/context/TrademarkThemeContext';
import { AllTheProviders } from '@/test/TestWrapper';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';

// Mock the theme store
const mockUseThemeStore = useThemeStore as unknown as jest.Mock;
jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(),
}));
jest.mock('@/context/TrademarkThemeContext');

describe('ThemeSwitcher', () => {
  // Mock implementation setup
  const mockSetBrand = jest.fn();
  const mockSetColorMode = jest.fn();
  const mockToggleSystemPreference = jest.fn();

  const createMockStore = (
    brand: Brand = 'homy',
    colorMode: ColorMode = 'light',
    isSystemPreference = false
  ) => ({
    brand,
    colorMode,
    isSystemPreference,
    setBrand: mockSetBrand,
    setColorMode: mockSetColorMode,
    toggleSystemPreference: mockToggleSystemPreference,
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock theme store implementation
    mockUseThemeStore.mockReturnValue(createMockStore());

    // Mock theme context implementation
    (useTrademarkTheme as jest.Mock).mockReturnValue({
      theme: {
        colorMode: 'light',
        tokens: {
          colors: {
            primary: '#000000',
          },
          spacing: {
            scale: {
              xs: '0.25rem',
              sm: '0.5rem',
              md: '1rem',
              lg: '1.5rem',
            },
          },
          borderRadius: {
            md: '0.375rem',
            lg: '0.5rem',
            pill: '9999px',
          },
          container: {
            maxWidth: {
              md: '768px',
            },
          },
        },
      },
    });
  });

  it('renders all brand options', () => {
    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    expect(screen.getByText('HOMY')).toBeInTheDocument();
    expect(screen.getByText('Neuro')).toBeInTheDocument();
    expect(screen.getByText('Lab')).toBeInTheDocument();
  });

  it('renders all theme options', () => {
    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setBrand when clicking a brand option', () => {
    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    fireEvent.click(screen.getByText('Neuro'));
    expect(mockSetBrand).toHaveBeenCalledWith('neuro');
  });

  it('calls setColorMode when clicking a theme option', () => {
    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    fireEvent.click(screen.getByText('Dark'));
    expect(mockSetColorMode).toHaveBeenCalledWith('dark');
  });

  it('calls toggleSystemPreference when clicking system option', () => {
    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    fireEvent.click(screen.getByText('System'));
    expect(mockToggleSystemPreference).toHaveBeenCalled();
  });

  it('shows active state for current brand', () => {
    mockUseThemeStore.mockReturnValue(createMockStore('neuro'));

    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    const neuroButton = screen.getByRole('button', { name: /switch to neuro brand/i });
    expect(neuroButton).toHaveAttribute('aria-label', 'Switch to Neuro brand');
    expect(neuroButton).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.1)',
    });
  });

  it('shows active state for current theme mode', () => {
    mockUseThemeStore.mockReturnValue(createMockStore('homy', 'dark'));

    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    const darkButton = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(darkButton).toHaveAttribute('aria-label', 'Switch to Dark theme');
    expect(darkButton).toHaveStyle({
      background: '#000000', // Primary color from mock theme
    });
  });

  it('shows active state for system preference when enabled', () => {
    mockUseThemeStore.mockReturnValue(createMockStore('homy', 'light', true));

    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    const systemButton = screen.getByRole('button', { name: /switch to system theme/i });
    expect(systemButton).toHaveAttribute('aria-label', 'Switch to System theme');
    expect(systemButton).toHaveStyle({
      background: '#000000', // Primary color from mock theme
    });
  });

  it('maintains responsive layout on mobile viewport', () => {
    // Mock window.matchMedia for testing responsive behavior
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<ThemeSwitcher />, { wrapper: AllTheProviders });

    const container = screen.getByRole('group');
    expect(container).toHaveStyle({
      flexDirection: 'column',
    });
  });
});
