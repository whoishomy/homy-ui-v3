import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from '../Container';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@/theme';

describe('Container', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
  };

  it('renders children correctly', () => {
    renderWithTheme(
      <Container>
        <div data-testid="child">Test Content</div>
      </Container>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct maxWidth based on prop', () => {
    const { container } = renderWithTheme(
      <Container maxWidth="sm" data-testid="container">
        Content
      </Container>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`max-width: ${lightTheme.tokens.container.maxWidth.sm}`);
  });

  it('applies correct padding based on prop', () => {
    const { container } = renderWithTheme(
      <Container padding="lg" data-testid="container">
        Content
      </Container>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`padding-left: ${lightTheme.tokens.spacing.scale.lg}`);
    expect(element).toHaveStyle(`padding-right: ${lightTheme.tokens.spacing.scale.lg}`);
  });

  it('centers content when center prop is true', () => {
    const { container } = renderWithTheme(
      <Container center data-testid="container">
        Content
      </Container>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('margin-left: auto');
    expect(element).toHaveStyle('margin-right: auto');
  });

  it('renders with custom HTML element when as prop is provided', () => {
    renderWithTheme(
      <Container as="section" data-testid="container">
        Content
      </Container>
    );
    expect(screen.getByTestId('container').tagName).toBe('SECTION');
  });
});
