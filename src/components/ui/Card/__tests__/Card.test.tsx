import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@/styles/theme';

describe('Card Component', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it('renders children correctly', () => {
    renderWithTheme(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { rerender } = renderWithTheme(
      <Card data-testid="card" variant="elevated">
        Content
      </Card>
    );
    let card = screen.getByTestId('card');
    expect(card).toHaveStyle({ background: 'white' });

    rerender(
      <ThemeProvider theme={lightTheme}>
        <Card data-testid="card" variant="outlined">
          Content
        </Card>
      </ThemeProvider>
    );
    card = screen.getByTestId('card');
    expect(card).toHaveStyle({ background: 'transparent' });

    rerender(
      <ThemeProvider theme={lightTheme}>
        <Card data-testid="card" variant="flat">
          Content
        </Card>
      </ThemeProvider>
    );
    card = screen.getByTestId('card');
    expect(card).not.toHaveStyle({ border: '1px solid' });
  });

  it('handles interactive state correctly', () => {
    renderWithTheme(
      <Card data-testid="card" interactive>
        Interactive Card
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('applies full width when specified', () => {
    renderWithTheme(
      <Card data-testid="card" isFullWidth>
        Full Width Card
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ width: '100%' });
  });

  it('applies correct padding based on size', () => {
    const { rerender } = renderWithTheme(
      <Card data-testid="card" padding="sm">
        Small Padding
      </Card>
    );
    let card = screen.getByTestId('card');
    expect(card).toHaveStyle({ padding: lightTheme.tokens.spacing.scale.sm });

    rerender(
      <ThemeProvider theme={lightTheme}>
        <Card data-testid="card" padding="lg">
          Large Padding
        </Card>
      </ThemeProvider>
    );
    card = screen.getByTestId('card');
    expect(card).toHaveStyle({ padding: lightTheme.tokens.spacing.scale.lg });
  });

  it('applies correct ARIA role', () => {
    const { rerender } = renderWithTheme(
      <Card role="region" data-testid="card">
        Region Card
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveAttribute('role', 'region');

    rerender(
      <ThemeProvider theme={lightTheme}>
        <Card role="article" data-testid="card">
          Article Card
        </Card>
      </ThemeProvider>
    );
    expect(screen.getByTestId('card')).toHaveAttribute('role', 'article');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithTheme(
      <Card ref={ref} data-testid="card">
        Ref Card
      </Card>
    );
    expect(ref.current).toBeTruthy();
    expect(ref.current).toEqual(screen.getByTestId('card'));
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Card onClick={handleClick} interactive data-testid="card">
        Clickable Card
      </Card>
    );
    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
