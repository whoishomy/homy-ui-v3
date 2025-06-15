import React from 'react';
import { render, screen, fireEvent } from '@/test/TestWrapper';
import { ThemeLanguageSelector } from '@/components/ui/ThemeLanguageSelector';
import { jest  } from '@jest/globals';

const mockOnLanguageChange = jest.fn();

describe('ThemeLanguageSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default language', () => {
    render(<ThemeLanguageSelector currentLanguage="tr" onLanguageChange={mockOnLanguageChange} />);

    expect(screen.getByText('🇹🇷')).toBeInTheDocument();
  });

  it('shows language options on click', () => {
    render(<ThemeLanguageSelector currentLanguage="tr" onLanguageChange={mockOnLanguageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /select language/i }));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('calls onLanguageChange when selecting a language', () => {
    render(<ThemeLanguageSelector currentLanguage="tr" onLanguageChange={mockOnLanguageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /select language/i }));
    fireEvent.click(screen.getByText('English'));

    expect(mockOnLanguageChange).toHaveBeenCalledWith('en');
  });

  it('toggles theme mode', () => {
    render(<ThemeLanguageSelector currentLanguage="tr" onLanguageChange={mockOnLanguageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(screen.getByRole('button', { name: /dark mode/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
