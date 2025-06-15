import React from 'react';
import { render, screen, fireEvent } from '@/test/TestWrapper';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useThemeStore } from '@/store/themeStore';
import { jest  } from '@jest/globals';

// Mock Framer Motion to avoid animation related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset theme store before each test
    useThemeStore.getState().reset();
  });

  it('renders brand options', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByText('HOMY™')).toBeInTheDocument();
    expect(screen.getByText('Neuro™')).toBeInTheDocument();
    expect(screen.getByText('Lab™')).toBeInTheDocument();
  });

  it('shows current brand as selected', () => {
    useThemeStore.getState().setBrand('Neuro');
    render(<ThemeSwitcher />);

    const neuroOption = screen.getByText('Neuro™').closest('button');
    expect(neuroOption).toHaveAttribute('aria-selected', 'true');
  });

  it('switches brand when clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByText('Lab™'));

    expect(useThemeStore.getState().currentBrand).toBe('Lab');
  });

  it('renders color mode options', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByLabelText(/light mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/system preference/i)).toBeInTheDocument();
  });

  it('shows current color mode as selected', () => {
    useThemeStore.getState().setColorMode('dark');
    render(<ThemeSwitcher />);

    const darkModeOption = screen.getByLabelText(/dark mode/i);
    expect(darkModeOption).toHaveAttribute('aria-checked', 'true');
  });

  it('switches color mode when clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByLabelText(/dark mode/i));

    expect(useThemeStore.getState().colorMode).toBe('dark');
  });

  it('toggles system preference when clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByLabelText(/system preference/i));

    expect(useThemeStore.getState().systemPreference).toBe(true);
  });

  it('applies correct theme classes based on selected options', () => {
    useThemeStore.getState().setBrand('Neuro');
    useThemeStore.getState().setColorMode('dark');
    render(<ThemeSwitcher />);

    const container = screen.getByTestId('theme-switcher');
    expect(container).toHaveClass('theme-neuro', 'theme-dark');
  });

  it('renders brand selector', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('combobox', { name: /select brand/i })).toBeInTheDocument();
  });

  it('renders theme mode buttons', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system/i })).toBeInTheDocument();
  });

  it('changes brand when selected', () => {
    render(<ThemeSwitcher />);
    const select = screen.getByRole('combobox', { name: /select brand/i });
    fireEvent.change(select, { target: { value: 'neuro' } });
    expect(useThemeStore.getState().brand).toBe('neuro');
  });

  it('changes theme mode when clicked', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /dark/i }));
    expect(useThemeStore.getState().colorMode).toBe('dark');
  });

  it('toggles system preference when clicked', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /system/i }));
    expect(useThemeStore.getState().isSystemPreference).toBe(true);
  });
});
