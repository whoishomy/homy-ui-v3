import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBadge } from '../StatusBadge';

const renderWithTheme = (ui: React.ReactNode) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('StatusBadge', () => {
  it('renders with default props', () => {
    renderWithTheme(<StatusBadge>Default Status</StatusBadge>);
    expect(screen.getByText('Default Status')).toBeInTheDocument();
  });

  it('applies color preset class', () => {
    renderWithTheme(<StatusBadge preset="success">Success</StatusBadge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('color-success');
  });

  it('applies ghost style when ghost prop is true', () => {
    renderWithTheme(<StatusBadge ghost>Ghost Style</StatusBadge>);
    const badge = screen.getByText('Ghost Style');
    expect(badge).toHaveClass('color-neutral--ghost');
  });

  it('renders status dot when withDot is true', () => {
    renderWithTheme(<StatusBadge withDot>With Dot</StatusBadge>);
    const badge = screen.getByText('With Dot');
    expect(badge.firstChild).toHaveStyle({
      width: '6px',
      height: '6px',
      borderRadius: '50%',
    });
  });

  it('handles click events when interactive', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <StatusBadge interactive onClick={handleClick}>
        Interactive
      </StatusBadge>
    );

    const badge = screen.getByText('Interactive');
    fireEvent.click(badge);
    expect(handleClick).toHaveBeenCalled();
  });

  it('does not handle click events when not interactive', () => {
    const handleClick = jest.fn();
    renderWithTheme(<StatusBadge onClick={handleClick}>Not Interactive</StatusBadge>);

    const badge = screen.getByText('Not Interactive');
    fireEvent.click(badge);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct ARIA attributes for interactive badge', () => {
    renderWithTheme(
      <StatusBadge interactive aria-label="Interactive Badge">
        Interactive
      </StatusBadge>
    );

    const badge = screen.getByRole('button');
    expect(badge).toHaveAttribute('aria-label', 'Interactive Badge');
    expect(badge).toHaveAttribute('tabIndex', '0');
  });

  it('applies correct ARIA attributes for non-interactive badge', () => {
    renderWithTheme(<StatusBadge>Status</StatusBadge>);
    const badge = screen.getByRole('status');
    expect(badge).not.toHaveAttribute('tabIndex');
  });

  it('uses children as aria-label when no explicit label provided', () => {
    renderWithTheme(<StatusBadge>Status Text</StatusBadge>);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'Status Text');
  });

  it('applies additional className', () => {
    renderWithTheme(<StatusBadge className="custom-class">With Custom Class</StatusBadge>);

    const badge = screen.getByText('With Custom Class');
    expect(badge).toHaveClass('custom-class');
  });
});
