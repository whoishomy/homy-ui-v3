import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@/styles/theme';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { CodeBlock } from '../CodeBlock';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Typography Components', () => {
  describe('Heading Component', () => {
    it('renders with default props', () => {
      renderWithTheme(<Heading>Test Heading</Heading>);
      const heading = screen.getByText('Test Heading');
      expect(heading.tagName).toBe('H2');
    });

    it('renders with custom heading level', () => {
      renderWithTheme(<Heading as="h1">H1 Heading</Heading>);
      const heading = screen.getByText('H1 Heading');
      expect(heading.tagName).toBe('H1');
    });

    it('applies custom size', () => {
      renderWithTheme(
        <Heading size="xl" data-testid="heading">
          Large Heading
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading).toHaveStyle({ fontSize: lightTheme.tokens.typography.scale['2xl'] });
    });

    it('applies text alignment', () => {
      renderWithTheme(
        <Heading align="center" data-testid="heading">
          Centered Heading
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading).toHaveStyle({ textAlign: 'center' });
    });

    it('handles margin removal', () => {
      renderWithTheme(
        <Heading noMargin data-testid="heading">
          No Margin Heading
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading).toHaveStyle({ margin: '0' });
    });
  });

  describe('Text Component', () => {
    it('renders with default props', () => {
      renderWithTheme(<Text>Test Text</Text>);
      const text = screen.getByText('Test Text');
      expect(text.tagName).toBe('P');
    });

    it('renders with custom element', () => {
      renderWithTheme(<Text as="span">Span Text</Text>);
      const text = screen.getByText('Span Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('applies variant styles', () => {
      renderWithTheme(
        <Text variant="muted" data-testid="text">
          Muted Text
        </Text>
      );
      const text = screen.getByTestId('text');
      expect(text).toHaveStyle({ color: lightTheme.text.secondary });
    });

    it('handles truncation', () => {
      renderWithTheme(
        <Text truncate data-testid="text">
          Truncated Text
        </Text>
      );
      const text = screen.getByTestId('text');
      expect(text).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });
  });

  describe('CodeBlock Component', () => {
    it('renders with default props', () => {
      renderWithTheme(<CodeBlock>console.log('test');</CodeBlock>);
      const code = screen.getByText("console.log('test');");
      expect(code.parentElement?.tagName).toBe('PRE');
    });

    it('renders line numbers when enabled', () => {
      const code = 'line 1\nline 2\nline 3';
      renderWithTheme(
        <CodeBlock showLineNumbers variant="block">
          {code}
        </CodeBlock>
      );
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('applies language class for syntax highlighting', () => {
      renderWithTheme(
        <CodeBlock language="javascript" data-testid="code">
          const x = 42;
        </CodeBlock>
      );
      const code = screen.getByText('const x = 42;');
      expect(code).toHaveClass('language-javascript');
    });

    it('handles word wrap', () => {
      renderWithTheme(
        <CodeBlock wrap data-testid="code">
          Long code line that should wrap
        </CodeBlock>
      );
      const pre = screen.getByTestId('code');
      expect(pre).toHaveStyle({ whiteSpace: 'pre-wrap' });
    });
  });
});
