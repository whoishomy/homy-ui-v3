import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { GridItem } from '../GridItem';
import { defaultTheme } from '@/theme/default';

describe('GridItem', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>);
  };

  it('renders children correctly', () => {
    renderWithTheme(<GridItem>Test Content</GridItem>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies span prop correctly', () => {
    const { container } = renderWithTheme(<GridItem span={6}>Content</GridItem>);
    const gridItem = container.firstChild as HTMLElement;
    expect(gridItem).toHaveStyle({ 'grid-column': 'span 6' });
  });

  it('applies responsive span values', () => {
    const { container } = renderWithTheme(
      <GridItem span={{ sm: 12, md: 6, lg: 4 }}>Content</GridItem>
    );
    const gridItem = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(gridItem);

    // Base style
    expect(gridItem).toHaveStyle({ 'grid-column': 'span 12' });

    // Media queries will be tested in integration tests
  });

  it('applies offset correctly', () => {
    const { container } = renderWithTheme(<GridItem offset={2}>Content</GridItem>);
    const gridItem = container.firstChild as HTMLElement;
    expect(gridItem).toHaveStyle({ 'margin-left': 'calc(16.666666666666664% + 1rem)' });
  });

  it('applies fill prop correctly', () => {
    const { container } = renderWithTheme(<GridItem fill>Content</GridItem>);
    const gridItem = container.firstChild as HTMLElement;
    expect(gridItem).toHaveStyle({ height: '100%' });
  });

  it('applies custom column start and end', () => {
    const { container } = renderWithTheme(
      <GridItem colStart={2} colEnd={4}>
        Content
      </GridItem>
    );
    const gridItem = container.firstChild as HTMLElement;
    expect(gridItem).toHaveStyle({
      'grid-column-start': '2',
      'grid-column-end': '4',
    });
  });

  it('applies order correctly', () => {
    const { container } = renderWithTheme(<GridItem order={2}>Content</GridItem>);
    const gridItem = container.firstChild as HTMLElement;
    expect(gridItem).toHaveStyle({ order: '2' });
  });
});
