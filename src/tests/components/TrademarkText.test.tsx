import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { TrademarkText } from '@/components/ui/TrademarkText';
import { TrademarkThemeProvider } from '@/context/TrademarkThemeContext';
import { createTheme } from '@/theme/createTheme';
import type { BrandName } from '@/types/BrandName';

const mockTheme = createTheme('homy' as BrandName, 'light');

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrademarkThemeProvider>{children}</TrademarkThemeProvider>
);

describe('TrademarkText', () => {
  it('renders children correctly', () => {
    render(
      <TestWrapper>
        <TrademarkText>Hello World</TrademarkText>
      </TestWrapper>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders trademark symbol when showSymbol is true', () => {
    render(
      <TestWrapper>
        <TrademarkText showSymbol>Brand Name</TrademarkText>
      </TestWrapper>
    );
    expect(screen.getByText('™')).toBeInTheDocument();
  });

  it('does not render trademark symbol when showSymbol is false', () => {
    render(
      <TestWrapper>
        <TrademarkText showSymbol={false}>Brand Name</TrademarkText>
      </TestWrapper>
    );
    expect(screen.queryByText('™')).not.toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <TestWrapper>
        <TrademarkText variant="title">Title</TrademarkText>
      </TestWrapper>
    );

    let element = screen.getByText('Title');
    expect(element).toHaveStyle({ fontWeight: 700 });

    rerender(
      <TestWrapper>
        <TrademarkText variant="subtitle">Subtitle</TrademarkText>
      </TestWrapper>
    );

    element = screen.getByText('Subtitle');
    expect(element).toHaveStyle({ fontWeight: 500 });
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <TestWrapper>
        <TrademarkText variant="title">Accessible Text</TrademarkText>
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies custom styles through options prop', () => {
    render(
      <TestWrapper>
        <TrademarkText
          options={{
            visualIdentity: {
              colors: { primary: '#FF0000' },
              typography: {
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: '0',
              },
              spacing: {
                padding: '0',
                margin: '0',
              },
            },
          }}
        >
          Custom Styled
        </TrademarkText>
      </TestWrapper>
    );

    const element = screen.getByText('Custom Styled');
    expect(element).toBeInTheDocument();
  });

  it('renders without animation when animate prop is false', () => {
    render(
      <TestWrapper>
        <TrademarkText animate={false}>Static Text</TrademarkText>
      </TestWrapper>
    );

    const element = screen.getByText('Static Text');
    expect(element.tagName.toLowerCase()).toBe('span');
    expect(element).not.toHaveAttribute('initial');
    expect(element).not.toHaveAttribute('animate');
  });
});
