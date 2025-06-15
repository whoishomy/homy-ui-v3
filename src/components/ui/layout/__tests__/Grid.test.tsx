import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Grid } from '../Grid';
import { ThemeProvider } from '@emotion/react';
import { themes } from '@/theme/themes';

const mockTheme = {
  ...themes.HOMY,
  colorMode: 'light' as const,
};

describe('Grid', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>);
  };

  it('renders children correctly', () => {
    renderWithTheme(
      <Grid>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Grid>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('applies correct column count', () => {
    const { container } = renderWithTheme(
      <Grid columns={3}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('grid-template-columns: repeat(3, minmax(0, 1fr))');
  });

  it('applies responsive columns', () => {
    const { container } = renderWithTheme(
      <Grid
        columns={{
          sm: 1,
          md: 2,
          lg: 3,
        }}
      >
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(element);
    expect(styles.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))');
  });

  it('applies correct spacing', () => {
    const { container } = renderWithTheme(
      <Grid spacing="lg">
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`gap: ${mockTheme.tokens.spacing.scale.lg}`);
  });

  it('applies responsive spacing', () => {
    const { container } = renderWithTheme(
      <Grid
        spacing={{
          sm: 'xs',
          md: 'md',
          lg: 'xl',
        }}
      >
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(element);
    expect(styles.gap).toBe(mockTheme.tokens.spacing.scale.xs);
  });

  it('applies minChildWidth correctly', () => {
    const { container } = renderWithTheme(
      <Grid minChildWidth="200px">
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))');
  });

  it('applies autoFit correctly', () => {
    const { container } = renderWithTheme(
      <Grid minChildWidth="200px" autoFit>
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))');
  });

  it('applies autoFill correctly', () => {
    const { container } = renderWithTheme(
      <Grid minChildWidth="200px" autoFill>
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))');
  });

  it('applies flowColumn correctly', () => {
    const { container } = renderWithTheme(
      <Grid flowColumn>
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('grid-auto-flow: column');
  });

  it('applies correct alignment', () => {
    const { container } = renderWithTheme(
      <Grid align="center" justify="center">
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle('align-items: center');
    expect(element).toHaveStyle('justify-content: center');
  });

  it('renders with custom HTML element', () => {
    renderWithTheme(
      <Grid as="section" data-testid="grid">
        <div>Child 1</div>
      </Grid>
    );
    expect(screen.getByTestId('grid').tagName).toBe('SECTION');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Grid>
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
