import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Button } from '../Button';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button', () => {
  it('renders with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with different presets', () => {
    const { rerender } = renderWithTheme(<Button preset="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Primary');

    rerender(
      <ThemeProvider>
        <Button preset="secondary">Secondary</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Secondary');
  });

  it('renders with different variants', () => {
    const { rerender } = renderWithTheme(<Button variant="solid">Solid</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Solid');

    rerender(
      <ThemeProvider>
        <Button variant="outline">Outline</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Outline');
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Small');

    rerender(
      <ThemeProvider>
        <Button size="lg">Large</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Large');
  });

  it('shows loading state', () => {
    renderWithTheme(<Button isLoading>Loading</Button>);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders with icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    const RightIcon = () => <span data-testid="right-icon">→</span>;

    renderWithTheme(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With Icons');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isLoading is true', () => {
    renderWithTheme(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders as full width when isFullWidth is true', () => {
    renderWithTheme(<Button isFullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ width: '100%' });
  });

  it('applies interactive animations by default', () => {
    renderWithTheme(<Button>Interactive</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ transition: 'all 0.2s ease-in-out' });
  });

  it('does not apply interactive animations when interactive is false', () => {
    renderWithTheme(<Button interactive={false}>Non Interactive</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).not.toHaveAttribute('whileTap');
  });
});
