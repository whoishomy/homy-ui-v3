import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '@emotion/react';
import { ContentArea } from '../ContentArea';
import { lightTheme } from '@/themes/light';

expect.extend(toHaveNoViolations);

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
};

describe('ContentArea', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ContentArea>Test Content</ContentArea>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    renderWithTheme(
      <ContentArea>
        <div data-testid="test-child">Child Content</div>
      </ContentArea>
    );
    expect(screen.getByTestId('test-child')).toHaveTextContent('Child Content');
  });

  it('applies padding by default', () => {
    const { container } = renderWithTheme(<ContentArea>Content</ContentArea>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveStyle(`padding: ${lightTheme.tokens.spacing.scale.lg}`);
  });

  it('can disable padding', () => {
    const { container } = renderWithTheme(<ContentArea hasPadding={false}>Content</ContentArea>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveStyle('padding: 0');
  });

  it('has minimum height based on viewport', () => {
    const { container } = renderWithTheme(<ContentArea>Content</ContentArea>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveStyle('min-height: calc(100vh - 72px)');
  });

  it('applies backdrop blur effect', () => {
    const { container } = renderWithTheme(<ContentArea>Content</ContentArea>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveStyle('backdrop-filter: blur(4px)');
  });

  it('passes custom className to container', () => {
    const { container } = renderWithTheme(
      <ContentArea className="custom-class">Content</ContentArea>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports animation variants', () => {
    const variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
    const { container } = renderWithTheme(<ContentArea variants={variants}>Content</ContentArea>);
    expect(container.firstChild).toHaveAttribute('data-framer-motion');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ContentArea>
        <main>
          <h1>Main Content</h1>
          <p>Some content here</p>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
        </main>
      </ContentArea>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Responsive Behavior', () => {
    it('maintains layout on different screen sizes', () => {
      const { container } = renderWithTheme(
        <ContentArea>
          <div>Content Block</div>
        </ContentArea>
      );

      // Test at mobile width
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();

      // Test at tablet width
      window.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();

      // Test at desktop width
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();
    });
  });

  describe('Theme Integration', () => {
    it('applies theme-based styles correctly', () => {
      const { container } = renderWithTheme(<ContentArea>Content</ContentArea>);
      const content = container.firstChild as HTMLElement;

      // Check background color from theme
      expect(content).toHaveStyle(
        `background: ${
          lightTheme.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.5)'
        }`
      );

      // Check border radius from theme
      expect(content).toHaveStyle(`border-radius: ${lightTheme.tokens.borderRadius.lg}`);
    });
  });
});
