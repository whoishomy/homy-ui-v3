import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { useHomyTheme } from '@/theme/hooks/useHomyTheme';
import { AllTheProviders } from '@/test/TestWrapper';

// Mock the theme hook
jest.mock('@/theme/hooks/useHomyTheme');
const mockUseHomyTheme = useHomyTheme as jest.Mock;

describe('ThemeToggleButton', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in light mode with moon icon', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button', { name: /tema değiştir/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  it('renders in dark mode with sun icon', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button', { name: /tema değiştir/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button', { name: /tema değiştir/i });
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has proper hover styles', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-gray-100');
  });

  it('has proper dark mode hover styles', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('dark:hover:bg-gray-800');
  });

  it('has proper accessibility attributes', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Tema Değiştir');
  });

  it('supports keyboard interaction', () => {
    mockUseHomyTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggleButton />, { wrapper: AllTheProviders });

    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: ' ' });
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
  });
});
