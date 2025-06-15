import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { TrademarkThemeProvider } from '@/context/TrademarkThemeContext';
import { useThemeStore } from '@/store/themeStore';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';

// Mock the theme store
const mockSetBrand = jest.fn();
const mockSetColorMode = jest.fn();
const mockToggleSystemPreference = jest.fn();

jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(),
}));

const mockThemeStore = {
  brand: 'homy' as Brand,
  colorMode: 'light' as ColorMode,
  isSystemPreference: false,
  setBrand: mockSetBrand,
  setColorMode: mockSetColorMode,
  toggleSystemPreference: mockToggleSystemPreference,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrademarkThemeProvider>{children}</TrademarkThemeProvider>
);

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    (useThemeStore as jest.Mock).mockImplementation(() => mockThemeStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all brand options', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    expect(screen.getByText('HOMY')).toBeInTheDocument();
    expect(screen.getByText('Neuro')).toBeInTheDocument();
    expect(screen.getByText('Lab')).toBeInTheDocument();
  });

  it('renders all theme options', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setBrand when clicking a brand option', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Neuro'));
    expect(mockSetBrand).toHaveBeenCalledWith('neuro');
  });

  it('calls setColorMode when clicking a theme option', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Dark'));
    expect(mockSetColorMode).toHaveBeenCalledWith('dark');
  });

  it('calls toggleSystemPreference when clicking system option', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('System'));
    expect(mockToggleSystemPreference).toHaveBeenCalled();
  });

  it('shows active state for current brand', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const activeButton = screen.getByText('HOMY').closest('button');
    expect(activeButton).toHaveAttribute('aria-label', 'Switch to HOMY brand');
  });

  it('shows active state for current theme mode', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const lightButton = screen.getByText('Light').closest('button');
    expect(lightButton).toHaveStyle({ background: expect.stringContaining('primary') });
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies hover styles on brand buttons', async () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const button = screen.getByText('HOMY').closest('button');
    fireEvent.mouseEnter(button!);
    expect(button).toHaveStyle({ transform: 'translateY(-1px)' });
  });

  it('handles system preference correctly', () => {
    (useThemeStore as jest.Mock).mockImplementation(() => ({
      ...mockThemeStore,
      isSystemPreference: true,
    }));

    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const systemButton = screen.getByText('System').closest('button');
    expect(systemButton).toHaveStyle({ background: expect.stringContaining('primary') });
  });
});
