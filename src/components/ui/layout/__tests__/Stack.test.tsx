import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Stack } from '../Stack';
import { ThemeProvider } from '@emotion/react';
import { themes } from '@/theme/themes';

const mockTheme = {
  ...themes.HOMY,
  colorMode: 'light' as const,
};

describe('Stack', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>);
  };

  it('renders children correctly', () => {
    renderWithTheme(
      <Stack>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Stack>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('applies correct direction styles', () => {
    const { container } = renderWithTheme(
      <Stack direction="horizontal" data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('flex-direction: row');
  });

  it('applies reverse direction when specified', () => {
    const { container } = renderWithTheme(
      <Stack direction="horizontal" reverse data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('flex-direction: row-reverse');
  });

  it('applies correct spacing', () => {
    const { container } = renderWithTheme(
      <Stack spacing="lg" data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`gap: ${mockTheme.tokens.spacing.scale.lg}`);
  });

  it('applies responsive spacing', () => {
    const { container } = renderWithTheme(
      <Stack
        spacing={{
          sm: 'xs',
          md: 'md',
          lg: 'xl',
        }}
        data-testid="stack"
      >
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(element);
    expect(styles.gap).toBe(mockTheme.tokens.spacing.scale.xs);
  });

  it('applies wrap when specified', () => {
    const { container } = renderWithTheme(
      <Stack wrap data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('flex-wrap: wrap');
  });

  it('renders custom divider when provided', () => {
    const CustomDivider = () => <hr data-testid="custom-divider" />;
    renderWithTheme(
      <Stack divider={<CustomDivider />} data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Stack>
    );
    expect(screen.getAllByTestId('custom-divider')).toHaveLength(2);
  });

  it('renders default dividers when divider is true', () => {
    renderWithTheme(
      <Stack divider data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Stack>
    );
    const dividers = screen.getAllByRole('separator');
    expect(dividers).toHaveLength(2);
  });

  it('applies correct alignment', () => {
    const { container } = renderWithTheme(
      <Stack align="center" justify="center" data-testid="stack">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('align-items: center');
    expect(element).toHaveStyle('justify-content: center');
  });

  it('renders with custom HTML element', () => {
    renderWithTheme(
      <Stack as="section" data-testid="stack">
        <div>Child 1</div>
      </Stack>
    );
    expect(screen.getByTestId('stack').tagName).toBe('SECTION');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Stack divider>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
